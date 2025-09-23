// src/store/slices/errorLogsSlice.js - Fixed initial state
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { errorLogsApi } from '../../services/hotFilesApi';

// Async thunks
export const fetchErrorLogs = createAsyncThunk(
  'errorLogs/fetchErrorLogs',
  async (params, { rejectWithValue }) => {
    try {
      const cleanParams = Object.entries(params || {}).reduce(
        (acc, [key, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            if (key === 'startDate' || key === 'endDate') {
              if (value instanceof Date) {
                acc[key] = value.toISOString().split('T')[0];
              } else if (value) {
                acc[key] = value;
              }
            } else {
              acc[key] = value;
            }
          }
          return acc;
        },
        {}
      );

      const response = await errorLogsApi.getErrorLogs(cleanParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchErrorLogDetails = createAsyncThunk(
  'errorLogs/fetchErrorLogDetails',
  async (params, { rejectWithValue }) => {
    try {
      let uploadId,
        queryParams = {};

      // Handle both old (string) and new (object) parameter formats
      if (typeof params === 'string') {
        // Backward compatibility: if params is just a string, it's the uploadId
        uploadId = params;
      } else {
        // New format: params is an object with uploadId and optional query parameters
        uploadId = params.uploadId;
        queryParams = {
          page: params.page,
          limit: params.limit,
          recordType: params.recordType,
          errorType: params.errorType,
        };
      }

      const response = await errorLogsApi.getErrorLogDetails(
        uploadId,
        queryParams
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchErrorStats = createAsyncThunk(
  'errorLogs/fetchErrorStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await errorLogsApi.getErrorStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchErrorLogs = createAsyncThunk(
  'errorLogs/searchErrorLogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await errorLogsApi.searchErrorLogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkDeleteErrorLogs = createAsyncThunk(
  'errorLogs/bulkDeleteErrorLogs',
  async (uploadIds, { rejectWithValue }) => {
    try {
      const response = await errorLogsApi.bulkDeleteErrorLogs(uploadIds);
      return { uploadIds, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Error logs list
  errorLogs: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRecords: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 25, // Changed from 20 to 25 (one of the valid options)
    },
    lastUpdated: null,
  },

  // Error log details
  selectedErrorLog: {
    data: null,
    loading: false,
    error: null,
  },

  // Error statistics
  stats: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },

  // Search results
  search: {
    results: [],
    loading: false,
    error: null,
    query: '',
    pagination: null,
  },

  // Filters and UI state
  filters: {
    status: null, // 'processing', 'completed', 'failed'
    startDate: null, // ISO 8601 date
    endDate: null, // ISO 8601 date
    page: 1,
    limit: 25,
  },

  // UI state
  ui: {
    selectedTab: 0,
    viewMode: 'table',
    showFilters: false,
    sortBy: 'uploadedAt',
    sortOrder: 'desc',
    selectedItems: [],
    showBulkActions: false,
    realtimeMode: false,
    autoRefresh: false,
    refreshInterval: 30000,
  },

  // Bulk operations
  bulkOperations: {
    loading: false,
    operation: null,
    selectedCount: 0,
    progress: 0,
  },

  // Export state
  export: {
    loading: false,
    format: 'csv',
    error: null,
  },
};

const errorLogsSlice = createSlice({
  name: 'errorLogs',
  initialState,
  reducers: {
    // Filters
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value === '' ? null : value;
      if (key !== 'page') {
        state.filters.page = 1;
      }
    },
    setFilters: (state, action) => {
      const cleanFilters = Object.entries(action.payload).reduce(
        (acc, [key, value]) => {
          acc[key] = value === '' ? null : value;
          return acc;
        },
        {}
      );
      state.filters = { ...state.filters, ...cleanFilters };
    },
    clearFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        page: state.filters.page,
        limit: state.filters.limit,
      };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setPageSize: (state, action) => {
      const newLimit = action.payload;
      // Ensure the new limit is one of the valid options
      if ([10, 25, 50, 100].includes(newLimit)) {
        state.filters.limit = newLimit;
        state.errorLogs.pagination.limit = newLimit;
        state.filters.page = 1;
      }
    },

    // Sorting
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.ui.sortBy = sortBy;
      state.ui.sortOrder = sortOrder;
    },

    // UI state
    setSelectedTab: (state, action) => {
      state.ui.selectedTab = action.payload;
    },
    setViewMode: (state, action) => {
      state.ui.viewMode = action.payload;
    },
    toggleFilters: (state) => {
      state.ui.showFilters = !state.ui.showFilters;
    },
    setShowFilters: (state, action) => {
      state.ui.showFilters = action.payload;
    },

    // Selection
    toggleErrorLogSelection: (state, action) => {
      const uploadId = action.payload;
      const index = state.ui.selectedItems.indexOf(uploadId);
      if (index === -1) {
        state.ui.selectedItems.push(uploadId);
      } else {
        state.ui.selectedItems.splice(index, 1);
      }
      state.ui.showBulkActions = state.ui.selectedItems.length > 0;
    },
    selectAllErrorLogs: (state) => {
      state.ui.selectedItems = state.errorLogs.data.map((log) => log.uploadId);
      state.ui.showBulkActions = true;
    },
    clearErrorLogSelection: (state) => {
      state.ui.selectedItems = [];
      state.ui.showBulkActions = false;
    },

    // Search
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },
    clearSearchResults: (state) => {
      state.search.results = [];
      state.search.pagination = null;
      state.search.query = '';
    },

    // Real-time updates
    setRealtimeMode: (state, action) => {
      state.ui.realtimeMode = action.payload;
    },
    setAutoRefresh: (state, action) => {
      state.ui.autoRefresh = action.payload;
    },
    setRefreshInterval: (state, action) => {
      state.ui.refreshInterval = action.payload;
    },

    // Export
    setExportFormat: (state, action) => {
      state.export.format = action.payload;
    },

    // Selected error log
    clearSelectedErrorLog: (state) => {
      state.selectedErrorLog.data = null;
      state.selectedErrorLog.error = null;
    },

    // Reset state
    resetErrorLogs: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Error Logs
      .addCase(fetchErrorLogs.pending, (state) => {
        state.errorLogs.loading = true;
        state.errorLogs.error = null;
      })
      .addCase(fetchErrorLogs.fulfilled, (state, action) => {
        state.errorLogs.loading = false;
        state.errorLogs.data = action.payload.data;
        state.errorLogs.pagination = action.payload.pagination;
        state.errorLogs.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchErrorLogs.rejected, (state, action) => {
        state.errorLogs.loading = false;
        state.errorLogs.error = action.payload;
      })

      // Fetch Error Log Details
      .addCase(fetchErrorLogDetails.pending, (state) => {
        state.selectedErrorLog.loading = true;
        state.selectedErrorLog.error = null;
      })
      .addCase(fetchErrorLogDetails.fulfilled, (state, action) => {
        state.selectedErrorLog.loading = false;
        state.selectedErrorLog.data = action.payload.data;
      })
      .addCase(fetchErrorLogDetails.rejected, (state, action) => {
        state.selectedErrorLog.loading = false;
        state.selectedErrorLog.error = action.payload;
      })

      // Fetch Error Stats
      .addCase(fetchErrorStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(fetchErrorStats.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats.data = action.payload.data;
        state.stats.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchErrorStats.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload;
      })

      // Search Error Logs
      .addCase(searchErrorLogs.pending, (state) => {
        state.search.loading = true;
        state.search.error = null;
      })
      .addCase(searchErrorLogs.fulfilled, (state, action) => {
        state.search.loading = false;
        state.search.results = action.payload.data;
        state.search.pagination = action.payload.pagination;
      })
      .addCase(searchErrorLogs.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.payload;
      })

      // Bulk Delete Error Logs
      .addCase(bulkDeleteErrorLogs.pending, (state) => {
        state.bulkOperations.loading = true;
        state.bulkOperations.operation = 'delete';
      })
      .addCase(bulkDeleteErrorLogs.fulfilled, (state, action) => {
        state.bulkOperations.loading = false;
        state.bulkOperations.operation = null;
        const deletedIds = state.ui.selectedItems;
        state.errorLogs.data = state.errorLogs.data.filter(
          (log) => !deletedIds.includes(log.uploadId)
        );
        state.ui.selectedItems = [];
        state.ui.showBulkActions = false;
      })
      .addCase(bulkDeleteErrorLogs.rejected, (state, action) => {
        state.bulkOperations.loading = false;
        state.bulkOperations.operation = null;
      });
  },
});

export const {
  setFilter,
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
  setSorting,
  setSelectedTab,
  setViewMode,
  toggleFilters,
  setShowFilters,
  toggleErrorLogSelection,
  selectAllErrorLogs,
  clearErrorLogSelection,
  setSearchQuery,
  clearSearchResults,
  setRealtimeMode,
  setAutoRefresh,
  setRefreshInterval,
  setExportFormat,
  clearSelectedErrorLog,
  resetErrorLogs,
} = errorLogsSlice.actions;

export default errorLogsSlice.reducer;
