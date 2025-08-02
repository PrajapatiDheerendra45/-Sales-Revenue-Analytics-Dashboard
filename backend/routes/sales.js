const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Sales = require('../models/Sales');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get total sales and revenue for a given period
router.get('/summary', [
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  validateRequest
], async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const summary = await Sales.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$quantity' },
          totalRevenue: { $sum: '$revenue' },
          averagePrice: { $avg: '$price' },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: summary[0] || {
        totalSales: 0,
        totalRevenue: 0,
        averagePrice: 0,
        transactionCount: 0
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch summary data' });
  }
});

// Filter sales by product, category, and region
router.get('/filter', [
  query('product').optional().isString(),
  query('category').optional().isString(),
  query('region').optional().isString(),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  validateRequest
], async (req, res) => {
  try {
    const { product, category, region, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (product) filter.product = { $regex: product, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (region) filter.region = { $regex: region, $options: 'i' };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const [sales, total] = await Promise.all([
      Sales.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Sales.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error filtering sales:', error);
    res.status(500).json({ success: false, error: 'Failed to filter sales data' });
  }
});

// Generate sales trend data (daily, weekly, monthly revenue)
router.get('/trends', [
  query('period').isIn(['daily', 'weekly', 'monthly']).withMessage('Period must be daily, weekly, or monthly'),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  validateRequest
], async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    const filter = {};
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    let dateFormat;
    let groupBy;
    
    switch (period) {
      case 'daily':
        dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
        break;
      case 'weekly':
        dateFormat = { $dateToString: { format: '%Y-W%U', date: '$date' } };
        groupBy = { $dateToString: { format: '%Y-W%U', date: '$date' } };
        break;
      case 'monthly':
        dateFormat = { $dateToString: { format: '%Y-%m', date: '$date' } };
        groupBy = { $dateToString: { format: '%Y-%m', date: '$date' } };
        break;
    }

    const trends = await Sales.aggregate([
      { $match: filter },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$revenue' },
          sales: { $sum: '$quantity' },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: trends.map(item => ({
        period: item._id,
        revenue: item.revenue,
        sales: item.sales,
        transactions: item.transactions
      }))
    });
  } catch (error) {
    console.error('Error generating trends:', error);
    res.status(500).json({ success: false, error: 'Failed to generate trend data' });
  }
});

// Get product-wise sales data
router.get('/products', [
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  validateRequest
], async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const products = await Sales.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$product',
          totalRevenue: { $sum: '$revenue' },
          totalSales: { $sum: '$quantity' },
          transactions: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: products.map(item => ({
        product: item._id,
        revenue: item.totalRevenue,
        sales: item.totalSales,
        transactions: item.transactions,
        averagePrice: Math.round(item.averagePrice * 100) / 100
      }))
    });
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product data' });
  }
});

// Get revenue by region
router.get('/regions', [
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  validateRequest
], async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const regions = await Sales.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$region',
          totalRevenue: { $sum: '$revenue' },
          totalSales: { $sum: '$quantity' },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: regions.map(item => ({
        region: item._id,
        revenue: item.totalRevenue,
        sales: item.totalSales,
        transactions: item.transactions
      }))
    });
  } catch (error) {
    console.error('Error fetching region data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch region data' });
  }
});

// Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Sales.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// Get unique regions
router.get('/regions-list', async (req, res) => {
  try {
    const regions = await Sales.distinct('region');
    res.json({
      success: true,
      data: regions
    });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch regions' });
  }
});

module.exports = router; 