import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://sales-revenue-analytics-dashboard.onrender.com/api/sales';

// Async thunks
export const fetchSummary = createAsyncThunk(
  'sales/fetchSummary',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await axios.get(`${API_BASE_URL}/summary?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch summary');
    }
  }
);

export const fetchTrends = createAsyncThunk(
  'sales/fetchTrends',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('period', filters.period || 'monthly');
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await axios.get(`${API_BASE_URL}/trends?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch trends');
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'sales/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await axios.get(`${API_BASE_URL}/products?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const fetchRegions = createAsyncThunk(
  'sales/fetchRegions',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await axios.get(`${API_BASE_URL}/regions?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch regions');
    }
  }
);

export const fetchFilteredSales = createAsyncThunk(
  'sales/fetchFilteredSales',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.product) params.append('product', filters.product);
      if (filters.category) params.append('category', filters.category);
      if (filters.region) params.append('region', filters.region);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await axios.get(`${API_BASE_URL}/filter?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch filtered sales');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'sales/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const fetchRegionsList = createAsyncThunk(
  'sales/fetchRegionsList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/regions-list`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch regions list');
    }
  }
);

const initialState = {
  summary: {
    data: null,
    loading: false,
    error: null,
  },
  trends: {
    data: [],
    loading: false,
    error: null,
  },
  products: {
    data: [],
    loading: false,
    error: null,
  },
  regions: {
    data: [],
    loading: false,
    error: null,
  },
  filteredSales: {
    data: [],
    pagination: {},
    loading: false,
    error: null,
  },
  categories: {
    data: [],
    loading: false,
    error: null,
  },
  regionsList: {
    data: [],
    loading: false,
    error: null,
  },
  filters: {
    startDate: null,
    endDate: null,
    product: '',
    category: '',
    region: '',
    period: 'monthly',
  },
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearErrors: (state) => {
      state.summary.error = null;
      state.trends.error = null;
      state.products.error = null;
      state.regions.error = null;
      state.filteredSales.error = null;
      state.categories.error = null;
      state.regionsList.error = null;
    },
  },
  extraReducers: (builder) => {
    // Summary
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.data = action.payload.data;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.payload;
      });

    // Trends
    builder
      .addCase(fetchTrends.pending, (state) => {
        state.trends.loading = true;
        state.trends.error = null;
      })
      .addCase(fetchTrends.fulfilled, (state, action) => {
        state.trends.loading = false;
        state.trends.data = action.payload.data;
      })
      .addCase(fetchTrends.rejected, (state, action) => {
        state.trends.loading = false;
        state.trends.error = action.payload;
      });

    // Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.data = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      });

    // Regions
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.regions.loading = true;
        state.regions.error = null;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regions.loading = false;
        state.regions.data = action.payload.data;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.regions.loading = false;
        state.regions.error = action.payload;
      });

    // Filtered Sales
    builder
      .addCase(fetchFilteredSales.pending, (state) => {
        state.filteredSales.loading = true;
        state.filteredSales.error = null;
      })
      .addCase(fetchFilteredSales.fulfilled, (state, action) => {
        state.filteredSales.loading = false;
        state.filteredSales.data = action.payload.data;
        state.filteredSales.pagination = action.payload.pagination;
      })
      .addCase(fetchFilteredSales.rejected, (state, action) => {
        state.filteredSales.loading = false;
        state.filteredSales.error = action.payload;
      });

    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = action.payload.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      });

    // Regions List
    builder
      .addCase(fetchRegionsList.pending, (state) => {
        state.regionsList.loading = true;
        state.regionsList.error = null;
      })
      .addCase(fetchRegionsList.fulfilled, (state, action) => {
        state.regionsList.loading = false;
        state.regionsList.data = action.payload.data;
      })
      .addCase(fetchRegionsList.rejected, (state, action) => {
        state.regionsList.loading = false;
        state.regionsList.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearErrors } = salesSlice.actions;
export default salesSlice.reducer; 