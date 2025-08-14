import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsApi } from '../../services/hotFilesApi';

// Async thunks
export const fetchRevenueAnalytics = createAsyncThunk(
  'analytics/fetchRevenueAnalytics',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getRevenueAnalytics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCommissionAnalytics = createAsyncThunk(
  'analytics/fetchCommissionAnalytics',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getCommissionAnalytics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPerformanceMetrics = createAsyncThunk(
  'analytics/fetchPerformanceMetrics',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getPerformanceMetrics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTravelPatterns = createAsyncThunk(
  'analytics/fetchTravelPatterns',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getTravelPatterns(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Revenue Analytics
  revenueAnalytics: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },

  // Commission Analytics
  commissionAnalytics: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },

  // Performance Metrics
  performanceMetrics: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },

  // Travel Patterns
  travelPatterns: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },

  // Filters
  filters: {
    dateRange: {
      startDate: null,
      endDate: null,
    },
    groupBy: 'day', // day, week, month
    currency: 'USD',
    agentCode: '',
    limit: 50,
  },

  // UI State
  ui: {
    selectedTab: 0, // 0: Revenue, 1: Commission, 2: Performance, 3: Travel
    chartType: 'line', // line, bar, area
    showFilters: false,
    viewMode: 'chart', // chart, table
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // Filter actions
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    setDateRange: (state, action) => {
      state.filters.dateRange = action.payload;
    },

    setCurrency: (state, action) => {
      state.filters.currency = action.payload;
    },

    setGroupBy: (state, action) => {
      state.filters.groupBy = action.payload;
    },

    // UI actions
    setSelectedTab: (state, action) => {
      state.ui.selectedTab = action.payload;
    },

    setChartType: (state, action) => {
      state.ui.chartType = action.payload;
    },

    setShowFilters: (state, action) => {
      state.ui.showFilters = action.payload;
    },

    toggleFilters: (state) => {
      state.ui.showFilters = !state.ui.showFilters;
    },

    setViewMode: (state, action) => {
      state.ui.viewMode = action.payload;
    },

    // Clear data
    clearRevenueAnalytics: (state) => {
      state.revenueAnalytics.data = null;
      state.revenueAnalytics.error = null;
    },

    clearCommissionAnalytics: (state) => {
      state.commissionAnalytics.data = null;
      state.commissionAnalytics.error = null;
    },

    clearPerformanceMetrics: (state) => {
      state.performanceMetrics.data = null;
      state.performanceMetrics.error = null;
    },

    clearTravelPatterns: (state) => {
      state.travelPatterns.data = null;
      state.travelPatterns.error = null;
    },

    clearAllAnalytics: (state) => {
      state.revenueAnalytics.data = null;
      state.commissionAnalytics.data = null;
      state.performanceMetrics.data = null;
      state.travelPatterns.data = null;
    },

    // Reset state
    resetAnalytics: () => initialState,
  },

  extraReducers: (builder) => {
    // Revenue Analytics
    builder
      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.revenueAnalytics.loading = true;
        state.revenueAnalytics.error = null;
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.revenueAnalytics.loading = false;
        state.revenueAnalytics.data = action.payload.data;
        state.revenueAnalytics.lastUpdated = new Date().toISOString();
        state.revenueAnalytics.error = null;
      })
      .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
        state.revenueAnalytics.loading = false;
        state.revenueAnalytics.error = action.payload;
      })

      // Commission Analytics
      .addCase(fetchCommissionAnalytics.pending, (state) => {
        state.commissionAnalytics.loading = true;
        state.commissionAnalytics.error = null;
      })
      .addCase(fetchCommissionAnalytics.fulfilled, (state, action) => {
        state.commissionAnalytics.loading = false;
        state.commissionAnalytics.data = action.payload.data;
        state.commissionAnalytics.lastUpdated = new Date().toISOString();
        state.commissionAnalytics.error = null;
      })
      .addCase(fetchCommissionAnalytics.rejected, (state, action) => {
        state.commissionAnalytics.loading = false;
        state.commissionAnalytics.error = action.payload;
      })

      // Performance Metrics
      .addCase(fetchPerformanceMetrics.pending, (state) => {
        state.performanceMetrics.loading = true;
        state.performanceMetrics.error = null;
      })
      .addCase(fetchPerformanceMetrics.fulfilled, (state, action) => {
        state.performanceMetrics.loading = false;
        state.performanceMetrics.data = action.payload.data;
        state.performanceMetrics.lastUpdated = new Date().toISOString();
        state.performanceMetrics.error = null;
      })
      .addCase(fetchPerformanceMetrics.rejected, (state, action) => {
        state.performanceMetrics.loading = false;
        state.performanceMetrics.error = action.payload;
      })

      // Travel Patterns
      .addCase(fetchTravelPatterns.pending, (state) => {
        state.travelPatterns.loading = true;
        state.travelPatterns.error = null;
      })
      .addCase(fetchTravelPatterns.fulfilled, (state, action) => {
        state.travelPatterns.loading = false;
        state.travelPatterns.data = action.payload.data;
        state.travelPatterns.lastUpdated = new Date().toISOString();
        state.travelPatterns.error = null;
      })
      .addCase(fetchTravelPatterns.rejected, (state, action) => {
        state.travelPatterns.loading = false;
        state.travelPatterns.error = action.payload;
      });
  },
});

export const {
  setFilter,
  setFilters,
  setDateRange,
  setCurrency,
  setGroupBy,
  setSelectedTab,
  setChartType,
  setShowFilters,
  toggleFilters,
  setViewMode,
  clearRevenueAnalytics,
  clearCommissionAnalytics,
  clearPerformanceMetrics,
  clearTravelPatterns,
  clearAllAnalytics,
  resetAnalytics,
} = analyticsSlice.actions;

// Selectors
export const selectRevenueAnalytics = (state) =>
  state.analytics.revenueAnalytics;
export const selectCommissionAnalytics = (state) =>
  state.analytics.commissionAnalytics;
export const selectPerformanceMetrics = (state) =>
  state.analytics.performanceMetrics;
export const selectTravelPatterns = (state) => state.analytics.travelPatterns;
export const selectAnalyticsFilters = (state) => state.analytics.filters;
export const selectAnalyticsUI = (state) => state.analytics.ui;

export const selectAnalyticsLoading = (state) =>
  state.analytics.revenueAnalytics.loading ||
  state.analytics.commissionAnalytics.loading ||
  state.analytics.performanceMetrics.loading ||
  state.analytics.travelPatterns.loading;

export const selectAnalyticsError = (state) =>
  state.analytics.revenueAnalytics.error ||
  state.analytics.commissionAnalytics.error ||
  state.analytics.performanceMetrics.error ||
  state.analytics.travelPatterns.error;

export default analyticsSlice.reducer;
