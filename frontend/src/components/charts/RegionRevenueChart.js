import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';

const RegionRevenueChart = ({ data, loading }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: 1,
            p: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Region: {data.name}
          </Typography>
          <Typography variant="body2" color="primary">
            Revenue: {formatCurrency(data.value)}
          </Typography>
          <Typography variant="body2" color="secondary">
            Sales: {data.payload.sales}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Percentage: {((data.value / data.payload.totalRevenue) * 100).toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography variant="body1" color="textSecondary">
          No data available
        </Typography>
      </Box>
    );
  }

  // Calculate total revenue for percentage calculation
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const chartData = data.map(item => ({
    ...item,
    totalRevenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="revenue"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RegionRevenueChart; 