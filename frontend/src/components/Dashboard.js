import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';

import Filters from './Filters';
import SummaryCards from './SummaryCards';
import RevenueTrendChart from './charts/RevenueTrendChart';
import ProductSalesChart from './charts/ProductSalesChart';
import RegionRevenueChart from './charts/RegionRevenueChart';
import SalesTable from './SalesTable';
import {
  fetchSummary,
  fetchTrends,
  fetchProducts,
  fetchRegions,
  fetchFilteredSales,
} from '../store/slices/salesSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { filters, summary, trends, products, regions, filteredSales } = useSelector(
    (state) => state.sales
  );

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          dispatch(fetchSummary(filters)),
          dispatch(fetchTrends(filters)),
          dispatch(fetchProducts(filters)),
          dispatch(fetchRegions(filters)),
          dispatch(fetchFilteredSales({ ...filters, page: 1, limit: 10 })),
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadDashboardData();
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialLoad) {
      const loadFilteredData = async () => {
        try {
          await Promise.all([
            dispatch(fetchSummary(filters)),
            dispatch(fetchTrends(filters)),
            dispatch(fetchProducts(filters)),
            dispatch(fetchRegions(filters)),
            dispatch(fetchFilteredSales({ ...filters, page: 1, limit: 10 })),
          ]);
        } catch (error) {
          console.error('Error loading filtered data:', error);
        }
      };

      loadFilteredData();
    }
  }, [dispatch, filters, isInitialLoad]);

  if (isInitialLoad) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Sales Analytics Dashboard
      </Typography>

      <Filters />

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Revenue Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Trends
              </Typography>
              <RevenueTrendChart data={trends.data} loading={trends.loading} />
            </CardContent>
          </Card>
        </Grid>

        {/* Region Revenue Chart */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue by Region
              </Typography>
              <RegionRevenueChart data={regions.data} loading={regions.loading} />
            </CardContent>
          </Card>
        </Grid>

        {/* Product Sales Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product-wise Sales
              </Typography>
              <ProductSalesChart data={products.data} loading={products.loading} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sales Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Sales
          </Typography>
          <SalesTable data={filteredSales} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 