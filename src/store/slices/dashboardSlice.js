import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../services/hotFilesApi';

// Async thunks
export const fetchExecutiveDashboard = createAsyncThunk(
  'dashboard/fetchExecutiveDashboard',
  async (params, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getExecutiveDashboard(params);
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
    dateRange: {
      startDate: null,
      endDate: null,
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
    revenueChart: true,
    performanceMetrics: true,
    filesSummary: true,
  },

  // Cache
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
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    setDateRange: (state, action) => {
      state.settings.dateRange = action.payload;
    },

    setCurrency: (state, action) => {
      state.settings.currency = action.payload;
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

    // Widget actions
    toggleWidget: (state, action) => {
      const widget = action.payload;
      state.widgets[widget] = !state.widgets[widget];
    },

    setWidgetVisibility: (state, action) => {
      const { widget, visible } = action.payload;
      state.widgets[widget] = visible;
    },

    resetWidgets: (state) => {
      state.widgets = initialState.widgets;
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
      })
      .addCase(fetchExecutiveDashboard.rejected, (state, action) => {
        state.executiveDashboard.loading = false;
        state.executiveDashboard.error = action.payload;
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
        state.officeDashboard.error = action.payload;
      });
  },
});

export const {
  updateSettings,
  setDateRange,
  setCurrency,
  setAutoRefresh,
  setRefreshInterval,
  setViewMode,
  toggleWidget,
  setWidgetVisibility,
  resetWidgets,
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
export const selectSelectedOffice = (state) =>
  state.dashboard.officeDashboard.selectedOffice;

// Memoized selectors for performance
export const selectDashboardLoading = (state) =>
  state.dashboard.executiveDashboard.loading ||
  state.dashboard.officeDashboard.loading;

export const selectDashboardError = (state) =>
  state.dashboard.executiveDashboard.error ||
  state.dashboard.officeDashboard.error;

export default dashboardSlice.reducer;
