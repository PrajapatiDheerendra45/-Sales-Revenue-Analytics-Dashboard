import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Clear as ClearIcon } from '@mui/icons-material';
import { setFilters, clearFilters } from '../store/slices/salesSlice';

const Filters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.sales);
  const { categories, regionsList } = useSelector((state) => state.sales);

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          {/* Date Range */}
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => handleFilterChange('endDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.data.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Region Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Region"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">All Regions</MenuItem>
              {regionsList.data.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Product Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Product"
              value={filters.product}
              onChange={(e) => handleFilterChange('product', e.target.value)}
              fullWidth
              size="small"
              placeholder="Search products..."
            />
          </Grid>

          {/* Period Filter */}
          <Grid item xs={12} sm={6} md={1}>
            <TextField
              select
              label="Period"
              value={filters.period}
              onChange={(e) => handleFilterChange('period', e.target.value)}
              fullWidth
              size="small"
            >
              {periodOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Clear Filters Button */}
          <Grid item xs={12} sm={6} md={1}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              fullWidth
              size="small"
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Filters; 