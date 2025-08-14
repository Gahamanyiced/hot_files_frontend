import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionApi } from '../../services/hotFilesApi';

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactions(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTransactionDetails = createAsyncThunk(
  'transactions/fetchTransactionDetails',
  async (transactionNumber, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactionDetails(transactionNumber);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTicketDetails = createAsyncThunk(
  'transactions/fetchTicketDetails',
  async (ticketNumber, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTicketDetails(ticketNumber);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Transactions list
  transactions: {
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
  
  // Transaction details
  transactionDetails: {
    data: null,
    loading: false,
    error: null,
    transactionNumber: null,
  },
  
  // Ticket details
  ticketDetails: {
    data: null,
    loading: false,
    error: null,
    ticketNumber: null,
  },
  
  // Filters
  filters: {
    page: 1,
    limit: 50,
    agentCode: '',
    startDate: '',
    endDate: '',
    ticketNumber: '',
    transactionCode: '',
    passengerName: '',
    sortBy: 'DAIS',
    sortOrder: 'desc',
  },
  
  // UI state
  ui: {
    selectedTransactions: [],
    expandedRows: [],
    viewMode: 'table', // 'table' | 'cards'
    showFilters: false,
    selectedTab: 0, // 0: All, 1: Recent, 2: Pending, etc.
  },
  
  // Cache for performance
  cache: {
    transactions: new Map(),
    transactionDetails: new Map(),
    ticketDetails: new Map(),
  },
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Filter actions
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      // Reset to first page when filters change
      if (key !== 'page') {
        state.filters.page = 1;
      }
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filters.page = 1; // Reset to first page
    },
    
    clearFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        limit: state.filters.limit, // Keep current page size
      };
    },
    
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    
    setPageSize: (state, action) => {
      state.filters.limit = action.payload;
      state.filters.page = 1; // Reset to first page
    },
    
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.filters.sortBy = sortBy;
      state.filters.sortOrder = sortOrder;
      state.filters.page = 1; // Reset to first page
    },
    
    // UI actions
    setSelectedTransactions: (state, action) => {
      state.ui.selectedTransactions = action.payload;
    },
    
    toggleTransactionSelection: (state, action) => {
      const transactionId = action.payload;
      const index = state.ui.selectedTransactions.indexOf(transactionId);
      
      if (index > -1) {
        state.ui.selectedTransactions.splice(index, 1);
      } else {
        state.ui.selectedTransactions.push(transactionId);
      }
    },
    
    selectAllTransactions: (state) => {
      state.ui.selectedTransactions = state.transactions.data.map(t => t.TRNN);
    },
    
    clearTransactionSelection: (state) => {
      state.ui.selectedTransactions = [];
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
    clearTransactions: (state) => {
      state.transactions.data = [];
      state.transactions.error = null;
    },
    
    clearTransactionDetails: (state) => {
      state.transactionDetails.data = null;
      state.transactionDetails.error = null;
      state.transactionDetails.transactionNumber = null;
    },
    
    clearTicketDetails: (state) => {
      state.ticketDetails.data = null;
      state.ticketDetails.error = null;
      state.ticketDetails.ticketNumber = null;
    },
    
    // Cache management
    clearCache: (state) => {
      state.cache.transactions.clear();
      state.cache.transactionDetails.clear();
      state.cache.ticketDetails.clear();
    },
    
    // Reset state
    resetTransactions: () => initialState,
  },
  
  extraReducers: (builder) => {
    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.transactions.loading = true;
        state.transactions.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions.loading = false;
        state.transactions.data = action.payload.data;
        state.transactions.pagination = action.payload.pagination;
        state.transactions.lastUpdated = new Date().toISOString();
        state.transactions.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error = action.payload;
      })
      
      // Fetch Transaction Details
      .addCase(fetchTransactionDetails.pending, (state, action) => {
        state.transactionDetails.loading = true;
        state.transactionDetails.error = null;
        state.transactionDetails.transactionNumber = action.meta.arg;
      })
      .addCase(fetchTransactionDetails.fulfilled, (state, action) => {
        state.transactionDetails.loading = false;
        state.transactionDetails.data = action.payload.data;
        state.transactionDetails.error = null;
      })
      .addCase(fetchTransactionDetails.rejected, (state, action) => {
        state.transactionDetails.loading = false;
        state.transactionDetails.error = action.payload;
      })
      
      // Fetch Ticket Details
      .addCase(fetchTicketDetails.pending, (state, action) => {
        state.ticketDetails.loading = true;
        state.ticketDetails.error = null;
        state.ticketDetails.ticketNumber = action.meta.arg;
      })
      .addCase(fetchTicketDetails.fulfilled, (state, action) => {
        state.ticketDetails.loading = false;
        state.ticketDetails.data = action.payload.data;
        state.ticketDetails.error = null;
      })
      .addCase(fetchTicketDetails.rejected, (state, action) => {
        state.ticketDetails.loading = false;
        state.ticketDetails.error = action.payload;
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
  setSelectedTransactions,
  toggleTransactionSelection,
  selectAllTransactions,
  clearTransactionSelection,
  toggleRowExpansion,
  setViewMode,
  toggleFilters,
  setShowFilters,
  setSelectedTab,
  clearTransactions,
  clearTransactionDetails,
  clearTicketDetails,
  clearCache,
  resetTransactions,
} = transactionSlice.actions;

// Selectors
export const selectTransactions = (state) => state.transactions.transactions;
export const selectTransactionDetails = (state) => state.transactions.transactionDetails;
export const selectTicketDetails = (state) => state.transactions.ticketDetails;
export const selectTransactionFilters = (state) => state.transactions.filters;
export const selectTransactionUI = (state) => state.transactions.ui;
export const selectTransactionPagination = (state) => state.transactions.transactions.pagination;

// Memoized selectors
export const selectTransactionLoading = (state) => 
  state.transactions.transactions.loading || 
  state.transactions.transactionDetails.loading || 
  state.transactions.ticketDetails.loading;

export const selectTransactionError = (state) => 
  state.transactions.transactions.error || 
  state.transactions.transactionDetails.error || 
  state.transactions.ticketDetails.error;

export const selectSelectedTransactionCount = (state) => 
  state.transactions.ui.selectedTransactions.length;

export default transactionSlice.reducer;