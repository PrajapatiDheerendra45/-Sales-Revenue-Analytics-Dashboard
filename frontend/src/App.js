import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, CssBaseline } from '@mui/material';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import { fetchCategories, fetchRegionsList } from './store/slices/salesSlice';

function App() {
  const dispatch = useDispatch();
  const { categories, regionsList } = useSelector((state) => state.sales);

  useEffect(() => {
    // Fetch initial data for filters
    if (categories.data.length === 0) {
      dispatch(fetchCategories());
    }
    if (regionsList.data.length === 0) {
      dispatch(fetchRegionsList());
    }
  }, [dispatch, categories.data.length, regionsList.data.length]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App; 