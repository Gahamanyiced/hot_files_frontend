import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { officeApi } from '../../services/hotFilesApi';

// Async thunks
export const fetchAllOffices = createAsyncThunk(
  'offices/fetchAllOffices',
  async (params, { rejectWithValue }) => {
    try {
      const response = await officeApi.getAllOffices(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOfficeDetails = createAsyncThunk(
  'offices/fetchOfficeDetails',
  async (agentCode, { rejectWithValue }) => {
    try {
      const response = await officeApi.getOfficeDetails(agentCode);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Offices list
  offices: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRecords: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 50,
    },
    lastUpdated: null,
  },

  // Office details
  officeDetails: {
    data: null,
    loading: false,
    error: null,
    agentCode: null,
  },

  // Filters
  filters: {
    page: 1,
    limit: 50,
    search: '',
    currency: '',
    sortBy: 'AGTN',
    sortOrder: 'asc',
  },

  // UI state
  ui: {
    selectedOffices: [],
    viewMode: 'table', // 'table' | 'cards'
    showFilters: false,
    selectedTab: 0, // 0: All, 1: Active, 2: Top Performers
  },
};

const officeSlice = createSlice({
  name: 'offices',
  initialState,
  reducers: {
    // Filter actions
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      if (key !== 'page') {
        state.filters.page = 1;
      }
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filters.page = 1;
    },

    clearFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        limit: state.filters.limit,
      };
    },

    setPage: (state, action) => {
      state.filters.page = action.payload;
    },

    setPageSize: (state, action) => {
      state.filters.limit = action.payload;
      state.filters.page = 1;
    },

    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.filters.sortBy = sortBy;
      state.filters.sortOrder = sortOrder;
      state.filters.page = 1;
    },

    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },

    // UI actions
    setSelectedOffices: (state, action) => {
      state.ui.selectedOffices = action.payload;
    },

    toggleOfficeSelection: (state, action) => {
      const agentCode = action.payload;
      const index = state.ui.selectedOffices.indexOf(agentCode);

      if (index > -1) {
        state.ui.selectedOffices.splice(index, 1);
      } else {
        state.ui.selectedOffices.push(agentCode);
      }
    },

    selectAllOffices: (state) => {
      state.ui.selectedOffices = state.offices.data.map(
        (office) => office.AGTN
      );
    },

    clearOfficeSelection: (state) => {
      state.ui.selectedOffices = [];
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

    setSelectedTab: (state, action) => {
      state.ui.selectedTab = action.payload;
    },

    // Clear data
    clearOffices: (state) => {
      state.offices.data = [];
      state.offices.error = null;
    },

    clearOfficeDetails: (state) => {
      state.officeDetails.data = null;
      state.officeDetails.error = null;
      state.officeDetails.agentCode = null;
    },

    // Reset state
    resetOffices: () => initialState,
  },

  extraReducers: (builder) => {
    // Fetch All Offices
    builder
      .addCase(fetchAllOffices.pending, (state) => {
        state.offices.loading = true;
        state.offices.error = null;
      })
      .addCase(fetchAllOffices.fulfilled, (state, action) => {
        state.offices.loading = false;
        state.offices.data = action.payload.data;
        state.offices.pagination = action.payload.pagination;
        state.offices.lastUpdated = new Date().toISOString();
        state.offices.error = null;
      })
      .addCase(fetchAllOffices.rejected, (state, action) => {
        state.offices.loading = false;
        state.offices.error = action.payload;
      })

      // Fetch Office Details
      .addCase(fetchOfficeDetails.pending, (state, action) => {
        state.officeDetails.loading = true;
        state.officeDetails.error = null;
        state.officeDetails.agentCode = action.meta.arg;
      })
      .addCase(fetchOfficeDetails.fulfilled, (state, action) => {
        state.officeDetails.loading = false;
        state.officeDetails.data = action.payload.data;
        state.officeDetails.error = null;
      })
      .addCase(fetchOfficeDetails.rejected, (state, action) => {
        state.officeDetails.loading = false;
        state.officeDetails.error = action.payload;
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
  setSearch,
  setSelectedOffices,
  toggleOfficeSelection,
  selectAllOffices,
  clearOfficeSelection,
  setViewMode,
  toggleFilters,
  setShowFilters,
  setSelectedTab,
  clearOffices,
  clearOfficeDetails,
  resetOffices,
} = officeSlice.actions;

// Selectors
export const selectOffices = (state) => state.offices.offices;
export const selectOfficeDetails = (state) => state.offices.officeDetails;
export const selectOfficeFilters = (state) => state.offices.filters;
export const selectOfficeUI = (state) => state.offices.ui;
export const selectOfficePagination = (state) =>
  state.offices.offices.pagination;

export const selectOfficeLoading = (state) =>
  state.offices.offices.loading || state.offices.officeDetails.loading;

export const selectOfficeError = (state) =>
  state.offices.offices.error || state.offices.officeDetails.error;

export const selectSelectedOfficeCount = (state) =>
  state.offices.ui.selectedOffices.length;

export default officeSlice.reducer;
