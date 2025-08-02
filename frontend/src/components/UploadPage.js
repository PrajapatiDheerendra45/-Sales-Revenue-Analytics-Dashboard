import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  Description,
  TableChart,
} from '@mui/icons-material';
import { uploadFile, clearUploadState } from '../store/slices/uploadSlice';

const UploadPage = () => {
  const dispatch = useDispatch();
  const { uploading, success, error, uploadResult } = useSelector(
    (state) => state.upload
  );
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    // Clear previous state
    dispatch(clearUploadState());

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid CSV or Excel file.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    dispatch(uploadFile(file));
  };

  const handleClearState = () => {
    dispatch(clearUploadState());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    return extension === 'csv' ? <TableChart /> : <Description />;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Upload Sales Data
      </Typography>

      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload File
              </Typography>
              
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
                  backgroundColor: dragActive ? '#f3f8ff' : '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#1976d2',
                    backgroundColor: '#f3f8ff',
                  },
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drag & Drop or Click to Upload
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Supports CSV and Excel files (max 10MB)
                </Typography>
                <Button
                  variant="contained"
                  component="span"
                  sx={{ mt: 2 }}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </Paper>

              {uploading && (
                <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography>Processing file...</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                File Requirements
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="File Format" 
                    secondary="CSV (.csv) or Excel (.xlsx, .xls) files only"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="File Size" 
                    secondary="Maximum 10MB per file"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Required Columns" 
                    secondary="date, product, category, region, quantity, price, revenue"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data Validation" 
                    secondary="All numeric fields must be positive numbers"
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Sample Format
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" fontFamily="monospace">
                  date,product,category,region,quantity,price,revenue<br />
                  2024-01-01,Laptop,Electronics,North,5,1200,6000<br />
                  2024-01-02,Smartphone,Electronics,South,3,800,2400
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Results Section */}
      {success && uploadResult && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" color="success.main">
                Upload Successful!
              </Typography>
            </Box>
            
            <Alert severity="success" sx={{ mb: 2 }}>
              {uploadResult.message}
            </Alert>

            <Typography variant="body1" gutterBottom>
              Upload Summary:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Records Inserted" 
                  secondary={uploadResult.data?.inserted || 0}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Total Records" 
                  secondary={uploadResult.data?.total || 0}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Errors" 
                  secondary={uploadResult.data?.errors || 0}
                />
              </ListItem>
            </List>

            <Button variant="outlined" onClick={handleClearState} sx={{ mt: 2 }}>
              Upload Another File
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Error color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" color="error">
                Upload Failed
              </Typography>
            </Box>
            
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.error || error.message || 'An error occurred during upload'}
            </Alert>

            <Button variant="outlined" onClick={handleClearState}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UploadPage; 