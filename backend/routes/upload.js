const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Sales = require('../models/Sales');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'), false);
    }
  }
});

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Process CSV file
const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Clean and validate data
        const cleanData = {
          date: new Date(data.date || data.Date || data.DATE),
          product: data.product || data.Product || data.PRODUCT || '',
          category: data.category || data.Category || data.CATEGORY || '',
          region: data.region || data.Region || data.REGION || '',
          quantity: parseInt(data.quantity || data.Quantity || data.QUANTITY) || 0,
          price: parseFloat(data.price || data.Price || data.PRICE) || 0,
          revenue: parseFloat(data.revenue || data.Revenue || data.REVENUE) || 0
        };

        // Validate required fields
        if (cleanData.date && cleanData.product && cleanData.category && 
            cleanData.region && cleanData.quantity > 0 && cleanData.price > 0) {
          results.push(cleanData);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Process Excel file
const processExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const results = data.map(row => {
      // Handle different column name variations
      const cleanData = {
        date: new Date(row.date || row.Date || row.DATE || row['Date']),
        product: row.product || row.Product || row.PRODUCT || row['Product'] || '',
        category: row.category || row.Category || row.CATEGORY || row['Category'] || '',
        region: row.region || row.Region || row.REGION || row['Region'] || '',
        quantity: parseInt(row.quantity || row.Quantity || row.QUANTITY || row['Quantity']) || 0,
        price: parseFloat(row.price || row.Price || row.PRICE || row['Price']) || 0,
        revenue: parseFloat(row.revenue || row.Revenue || row.REVENUE || row['Revenue']) || 0
      };

      return cleanData;
    }).filter(item => 
      item.date && item.product && item.category && 
      item.region && item.quantity > 0 && item.price > 0
    );

    return results;
  } catch (error) {
    throw new Error('Error processing Excel file: ' + error.message);
  }
};

// Upload and process file
router.post('/file', [
  upload.single('file'),
  validateRequest
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let processedData = [];

    try {
      if (fileExtension === '.csv') {
        processedData = await processCSV(filePath);
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        processedData = await processExcel(filePath);
      } else {
        throw new Error('Unsupported file format');
      }
    } catch (error) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      throw error;
    }

    if (processedData.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        error: 'No valid data found in the uploaded file'
      });
    }

    // Insert data into database
    const result = await Sales.insertMany(processedData, { 
      ordered: false,
      rawResult: true 
    });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Successfully imported ${result.insertedCount} records`,
      data: {
        inserted: result.insertedCount,
        total: processedData.length,
        errors: result.writeErrors ? result.writeErrors.length : 0
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process uploaded file',
      message: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 10MB.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  next(error);
});

module.exports = router; 