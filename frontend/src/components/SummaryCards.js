import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  Receipt,
} from '@mui/icons-material';

const SummaryCards = ({ summary }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: summary.data?.totalRevenue || 0,
      icon: <AttachMoney sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2',
      formatter: formatCurrency,
    },
    {
      title: 'Total Sales',
      value: summary.data?.totalSales || 0,
      icon: <ShoppingCart sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#2e7d32',
      formatter: formatNumber,
    },
    {
      title: 'Transactions',
      value: summary.data?.transactionCount || 0,
      icon: <Receipt sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#ed6c02',
      formatter: formatNumber,
    },
    {
      title: 'Average Price',
      value: summary.data?.averagePrice || 0,
      icon: <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />,
      color: '#0288d1',
      formatter: formatCurrency,
    },
  ];

  if (summary.loading) {
    return (
      <Box display="flex" justifyContent="center" mb={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: '100%',
              background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}05 100%)`,
              border: `1px solid ${card.color}20`,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {card.formatter(card.value)}
                  </Typography>
                </Box>
                <Box>{card.icon}</Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards; 