import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerApi } from '../../services/hotFilesApi';

// Async thunks
export const fetchPassengers = createAsyncThunk(
  'customers/fetchPassengers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await customerApi.getPassengers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPassengerHistory = createAsyncThunk(
  'customers/fetchPassengerHistory',
  async (transactionNumber, { rejectWithValue }) => {
    try {
      const response = await customerApi.getPassengerHistory(transactionNumber);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Passengers list
  passengers: {
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

  // Passenger history
  passengerHistory: {
    data: null,
    loading: false,
    error: null,
    transactionNumber: null,
  },

  // Filters
  filters: {
    page: 1,
    limit: 50,
    search: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'DAIS',
    sortOrder: 'desc',
  },

  // UI state
  ui: {
    selectedPassengers: [],
    viewMode: 'table', // 'table' | 'cards'
    showFilters: false,
    selectedTab: 0, // 0: All, 1: Recent, 2: Frequent Travelers
    expandedRows: [],
  },
};

const customerSlice = createSlice({
  name: 'customers',
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

    setDateRange: (state, action) => {
      const { dateFrom, dateTo } = action.payload;
      state.filters.dateFrom = dateFrom;
      state.filters.dateTo = dateTo;
      state.filters.page = 1;
    },

    // UI actions
    setSelectedPassengers: (state, action) => {
      state.ui.selectedPassengers = action.payload;
    },

    togglePassengerSelection: (state, action) => {
      const transactionNumber = action.payload;
      const index = state.ui.selectedPassengers.indexOf(transactionNumber);

      if (index > -1) {
        state.ui.selectedPassengers.splice(index, 1);
      } else {
        state.ui.selectedPassengers.push(transactionNumber);
      }
    },

    selectAllPassengers: (state) => {
      state.ui.selectedPassengers = state.passengers.data.map(
        (passenger) => passenger.TRNN
      );
    },

    clearPassengerSelection: (state) => {
      state.ui.selectedPassengers = [];
    },

    toggleRowExpansion: (state, action) => {
      const rowId = action.payload;
      const index = state.ui.expandedRows.indexOf(rowId);

      if (index > -1) {
        state.ui.expandedRows.splice(index, 1);
      } else {
        state.ui.expandedRows.push(rowId);
      }
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
    clearPassengers: (state) => {
      state.passengers.data = [];
      state.passengers.error = null;
    },

    clearPassengerHistory: (state) => {
      state.passengerHistory.data = null;
      state.passengerHistory.error = null;
      state.passengerHistory.transactionNumber = null;
    },

    // Reset state
    resetCustomers: () => initialState,
  },

  extraReducers: (builder) => {
    // Fetch Passengers
    builder
      .addCase(fetchPassengers.pending, (state) => {
        state.passengers.loading = true;
        state.passengers.error = null;
      })
      .addCase(fetchPassengers.fulfilled, (state, action) => {
        state.passengers.loading = false;
        state.passengers.data = action.payload.data;
        state.passengers.pagination = action.payload.pagination;
        state.passengers.lastUpdated = new Date().toISOString();
        state.passengers.error = null;
      })
      .addCase(fetchPassengers.rejected, (state, action) => {
        state.passengers.loading = false;
        state.passengers.error = action.payload;
      })

      // Fetch Passenger History
      .addCase(fetchPassengerHistory.pending, (state, action) => {
        state.passengerHistory.loading = true;
        state.passengerHistory.error = null;
        state.passengerHistory.transactionNumber = action.meta.arg;
      })
      .addCase(fetchPassengerHistory.fulfilled, (state, action) => {
        state.passengerHistory.loading = false;
        state.passengerHistory.data = action.payload.data;
        state.passengerHistory.error = null;
      })
      .addCase(fetchPassengerHistory.rejected, (state, action) => {
        state.passengerHistory.loading = false;
        state.passengerHistory.error = action.payload;
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
  setDateRange,
  setSelectedPassengers,
  togglePassengerSelection,
  selectAllPassengers,
  clearPassengerSelection,
  toggleRowExpansion,
  setViewMode,
  toggleFilters,
  setShowFilters,
  setSelectedTab,
  clearPassengers,
  clearPassengerHistory,
  resetCustomers,
} = customerSlice.actions;

// Selectors
export const selectPassengers = (state) => state.customers.passengers;
export const selectPassengerHistory = (state) =>
  state.customers.passengerHistory;
export const selectCustomerFilters = (state) => state.customers.filters;
export const selectCustomerUI = (state) => state.customers.ui;
export const selectCustomerPagination = (state) =>
  state.customers.passengers.pagination;

export const selectCustomerLoading = (state) =>
  state.customers.passengers.loading ||
  state.customers.passengerHistory.loading;

export const selectCustomerError = (state) =>
  state.customers.passengers.error || state.customers.passengerHistory.error;

export const selectSelectedPassengerCount = (state) =>
  state.customers.ui.selectedPassengers.length;

export default customerSlice.reducer;
