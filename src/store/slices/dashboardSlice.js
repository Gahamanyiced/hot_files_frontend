// src/store/slices/dashboardSlice.js - Updated for new API structure
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../services/hotFilesApi';

// Async thunks
export const fetchExecutiveDashboard = createAsyncThunk(
  'dashboard/fetchExecutiveDashboard',
  async (params, { rejectWithValue }) => {
    try {
      // Transform params to API format
      const apiParams = {
        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined,
        currency: params.currency || 'USD',
        allCurrencies: params.allCurrencies ? 'true' : 'false',
      };

      // Remove undefined values
      Object.keys(apiParams).forEach(
        (key) => apiParams[key] === undefined && delete apiParams[key]
      );

      const response = await dashboardApi.getExecutiveDashboard(apiParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOfficeDashboard = createAsyncThunk(
  'dashboard/fetchOfficeDashboard',
  async ({ agentCode, params }, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getOfficeDashboard(agentCode, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Executive Dashboard
  executiveDashboard: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },

  // Office Dashboard
  officeDashboard: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
    selectedOffice: null,
  },

  // Dashboard Settings
  settings: {
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
    currency: 'USD',
    allCurrencies: false, // Single currency mode by default
    dateRange: {
      startDate: null, // YYMMDD format
      endDate: null, // YYMMDD format
    },
    viewMode: 'overview', // 'overview' | 'detailed'
  },

  // Widgets visibility
  widgets: {
    totalTransactions: true,
    totalRevenue: true,
    totalCommission: true,
    topOffices: true,
    recentTransactions: true,
    filesSummary: true,
    performanceMetrics: true,
    revenueChart: true,
  },

  // Cache for performance
  cache: {
    executiveDashboard: new Map(),
    officeDashboard: new Map(),
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Settings actions
    setDateRange: (state, action) => {
      state.settings.dateRange = action.payload;
    },

    setCurrency: (state, action) => {
      state.settings.currency = action.payload;
    },

    setAllCurrencies: (state, action) => {
      state.settings.allCurrencies = action.payload;
    },

    setAutoRefresh: (state, action) => {
      state.settings.autoRefresh = action.payload;
    },

    setRefreshInterval: (state, action) => {
      state.settings.refreshInterval = action.payload;
    },

    setViewMode: (state, action) => {
      state.settings.viewMode = action.payload;
    },

    // Widget visibility toggles
    toggleWidget: (state, action) => {
      const widgetName = action.payload;
      if (widgetName in state.widgets) {
        state.widgets[widgetName] = !state.widgets[widgetName];
      }
    },

    setWidgetVisibility: (state, action) => {
      const { widget, visible } = action.payload;
      if (widget in state.widgets) {
        state.widgets[widget] = visible;
      }
    },

    // Office selection
    setSelectedOffice: (state, action) => {
      state.officeDashboard.selectedOffice = action.payload;
    },

    // Clear data
    clearExecutiveDashboard: (state) => {
      state.executiveDashboard.data = null;
      state.executiveDashboard.error = null;
    },

    clearOfficeDashboard: (state) => {
      state.officeDashboard.data = null;
      state.officeDashboard.error = null;
      state.officeDashboard.selectedOffice = null;
    },

    // Cache management
    clearCache: (state) => {
      state.cache.executiveDashboard.clear();
      state.cache.officeDashboard.clear();
    },

    // Reset state
    resetDashboard: () => initialState,
  },

  extraReducers: (builder) => {
    // Executive Dashboard
    builder
      .addCase(fetchExecutiveDashboard.pending, (state) => {
        state.executiveDashboard.loading = true;
        state.executiveDashboard.error = null;
      })
      .addCase(fetchExecutiveDashboard.fulfilled, (state, action) => {
        state.executiveDashboard.loading = false;
        state.executiveDashboard.data = action.payload.data;
        state.executiveDashboard.lastUpdated = new Date().toISOString();
        state.executiveDashboard.error = null;

        // Log the mode for debugging
        console.log('Dashboard mode:', action.payload.data?.mode);
        console.log('Dashboard data:', action.payload.data);
      })
      .addCase(fetchExecutiveDashboard.rejected, (state, action) => {
        state.executiveDashboard.loading = false;
        state.executiveDashboard.error = action.payload || {
          message: 'Failed to fetch executive dashboard data',
        };
      })

      // Office Dashboard
      .addCase(fetchOfficeDashboard.pending, (state) => {
        state.officeDashboard.loading = true;
        state.officeDashboard.error = null;
      })
      .addCase(fetchOfficeDashboard.fulfilled, (state, action) => {
        state.officeDashboard.loading = false;
        state.officeDashboard.data = action.payload.data;
        state.officeDashboard.lastUpdated = new Date().toISOString();
        state.officeDashboard.error = null;
      })
      .addCase(fetchOfficeDashboard.rejected, (state, action) => {
        state.officeDashboard.loading = false;
        state.officeDashboard.error = action.payload || {
          message: 'Failed to fetch office dashboard data',
        };
      });
  },
});

// Export actions
export const {
  setDateRange,
  setCurrency,
  setAllCurrencies,
  setAutoRefresh,
  setRefreshInterval,
  setViewMode,
  toggleWidget,
  setWidgetVisibility,
  setSelectedOffice,
  clearExecutiveDashboard,
  clearOfficeDashboard,
  clearCache,
  resetDashboard,
} = dashboardSlice.actions;

// Selectors
export const selectExecutiveDashboard = (state) =>
  state.dashboard.executiveDashboard;
export const selectOfficeDashboard = (state) => state.dashboard.officeDashboard;
export const selectDashboardSettings = (state) => state.dashboard.settings;
export const selectDashboardWidgets = (state) => state.dashboard.widgets;

// Export reducer
export default dashboardSlice.reducer;
