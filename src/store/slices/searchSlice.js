import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchApi } from '../../services/hotFilesApi';

// Async thunks
export const performGlobalSearch = createAsyncThunk(
  'search/performGlobalSearch',
  async (params, { rejectWithValue }) => {
    try {
      const response = await searchApi.globalSearch(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const performQuickLookup = createAsyncThunk(
  'search/performQuickLookup',
  async ({ type, value }, { rejectWithValue }) => {
    try {
      const response = await searchApi.quickLookup(type, value);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Global search
  globalSearch: {
    results: null,
    loading: false,
    error: null,
    query: '',
    type: 'all',
    limit: 20,
    lastSearched: null,
  },

  // Quick lookup
  quickLookup: {
    result: null,
    loading: false,
    error: null,
    type: '',
    value: '',
    lastLookedUp: null,
  },

  // Search history
  searchHistory: {
    queries: [],
    lookups: [],
    maxSize: 20,
  },

  // Search suggestions
  suggestions: {
    data: [],
    loading: false,
    error: null,
  },

  // UI state
  ui: {
    showSearchDialog: false,
    showAdvancedSearch: false,
    selectedSearchType: 'all',
    activeTab: 0, // 0: Global Search, 1: Quick Lookup
    showFilters: false,
  },

  // Search filters
  filters: {
    dateRange: {
      startDate: null,
      endDate: null,
    },
    recordTypes: [], // Filter by specific record types
    sortBy: 'relevance',
    sortOrder: 'desc',
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Search query actions
    setSearchQuery: (state, action) => {
      state.globalSearch.query = action.payload;
    },

    setSearchType: (state, action) => {
      state.globalSearch.type = action.payload;
    },

    setSearchLimit: (state, action) => {
      state.globalSearch.limit = action.payload;
    },

    // Quick lookup actions
    setLookupType: (state, action) => {
      state.quickLookup.type = action.payload;
    },

    setLookupValue: (state, action) => {
      state.quickLookup.value = action.payload;
    },

    // Search history actions
    addToSearchHistory: (state, action) => {
      const {
        query,
        type,
        timestamp = new Date().toISOString(),
      } = action.payload;

      // Remove if already exists
      state.searchHistory.queries = state.searchHistory.queries.filter(
        (item) => !(item.query === query && item.type === type)
      );

      // Add to beginning
      state.searchHistory.queries.unshift({ query, type, timestamp });

      // Keep only max size
      if (state.searchHistory.queries.length > state.searchHistory.maxSize) {
        state.searchHistory.queries = state.searchHistory.queries.slice(
          0,
          state.searchHistory.maxSize
        );
      }
    },

    addToLookupHistory: (state, action) => {
      const {
        type,
        value,
        timestamp = new Date().toISOString(),
      } = action.payload;

      // Remove if already exists
      state.searchHistory.lookups = state.searchHistory.lookups.filter(
        (item) => !(item.type === type && item.value === value)
      );

      // Add to beginning
      state.searchHistory.lookups.unshift({ type, value, timestamp });

      // Keep only max size
      if (state.searchHistory.lookups.length > state.searchHistory.maxSize) {
        state.searchHistory.lookups = state.searchHistory.lookups.slice(
          0,
          state.searchHistory.maxSize
        );
      }
    },

    clearSearchHistory: (state) => {
      state.searchHistory.queries = [];
    },

    clearLookupHistory: (state) => {
      state.searchHistory.lookups = [];
    },

    clearAllHistory: (state) => {
      state.searchHistory.queries = [];
      state.searchHistory.lookups = [];
    },

    // Filter actions
    setSearchFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },

    setSearchFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    setDateRange: (state, action) => {
      state.filters.dateRange = action.payload;
    },

    setRecordTypes: (state, action) => {
      state.filters.recordTypes = action.payload;
    },

    clearSearchFilters: (state) => {
      state.filters = initialState.filters;
    },

    // UI actions
    setShowSearchDialog: (state, action) => {
      state.ui.showSearchDialog = action.payload;
    },

    setShowAdvancedSearch: (state, action) => {
      state.ui.showAdvancedSearch = action.payload;
    },

    setSelectedSearchType: (state, action) => {
      state.ui.selectedSearchType = action.payload;
    },

    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload;
    },

    setShowFilters: (state, action) => {
      state.ui.showFilters = action.payload;
    },

    toggleAdvancedSearch: (state) => {
      state.ui.showAdvancedSearch = !state.ui.showAdvancedSearch;
    },

    toggleFilters: (state) => {
      state.ui.showFilters = !state.ui.showFilters;
    },

    // Suggestions actions
    setSuggestions: (state, action) => {
      state.suggestions.data = action.payload;
    },

    clearSuggestions: (state) => {
      state.suggestions.data = [];
    },

    // Clear results
    clearGlobalSearchResults: (state) => {
      state.globalSearch.results = null;
      state.globalSearch.error = null;
    },

    clearQuickLookupResult: (state) => {
      state.quickLookup.result = null;
      state.quickLookup.error = null;
    },

    clearAllResults: (state) => {
      state.globalSearch.results = null;
      state.globalSearch.error = null;
      state.quickLookup.result = null;
      state.quickLookup.error = null;
    },

    // Reset state
    resetSearch: () => initialState,
  },

  extraReducers: (builder) => {
    // Global Search
    builder
      .addCase(performGlobalSearch.pending, (state) => {
        state.globalSearch.loading = true;
        state.globalSearch.error = null;
      })
      .addCase(performGlobalSearch.fulfilled, (state, action) => {
        state.globalSearch.loading = false;
        state.globalSearch.results = action.payload.data;
        state.globalSearch.lastSearched = new Date().toISOString();
        state.globalSearch.error = null;

        // Add to search history
        searchSlice.caseReducers.addToSearchHistory(state, {
          payload: {
            query: state.globalSearch.query,
            type: state.globalSearch.type,
          },
        });
      })
      .addCase(performGlobalSearch.rejected, (state, action) => {
        state.globalSearch.loading = false;
        state.globalSearch.error = action.payload;
      })

      // Quick Lookup
      .addCase(performQuickLookup.pending, (state) => {
        state.quickLookup.loading = true;
        state.quickLookup.error = null;
      })
      .addCase(performQuickLookup.fulfilled, (state, action) => {
        state.quickLookup.loading = false;
        state.quickLookup.result = action.payload.data;
        state.quickLookup.lastLookedUp = new Date().toISOString();
        state.quickLookup.error = null;

        // Add to lookup history
        searchSlice.caseReducers.addToLookupHistory(state, {
          payload: {
            type: state.quickLookup.type,
            value: state.quickLookup.value,
          },
        });
      })
      .addCase(performQuickLookup.rejected, (state, action) => {
        state.quickLookup.loading = false;
        state.quickLookup.error = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setSearchType,
  setSearchLimit,
  setLookupType,
  setLookupValue,
  addToSearchHistory,
  addToLookupHistory,
  clearSearchHistory,
  clearLookupHistory,
  clearAllHistory,
  setSearchFilter,
  setSearchFilters,
  setDateRange,
  setRecordTypes,
  clearSearchFilters,
  setShowSearchDialog,
  setShowAdvancedSearch,
  setSelectedSearchType,
  setActiveTab,
  setShowFilters,
  toggleAdvancedSearch,
  toggleFilters,
  setSuggestions,
  clearSuggestions,
  clearGlobalSearchResults,
  clearQuickLookupResult,
  clearAllResults,
  resetSearch,
} = searchSlice.actions;

// Selectors
export const selectGlobalSearch = (state) => state.search.globalSearch;
export const selectQuickLookup = (state) => state.search.quickLookup;
export const selectSearchHistory = (state) => state.search.searchHistory;
export const selectSuggestions = (state) => state.search.suggestions;
export const selectSearchUI = (state) => state.search.ui;
export const selectSearchFilters = (state) => state.search.filters;

export const selectSearchLoading = (state) =>
  state.search.globalSearch.loading ||
  state.search.quickLookup.loading ||
  state.search.suggestions.loading;

export const selectSearchError = (state) =>
  state.search.globalSearch.error ||
  state.search.quickLookup.error ||
  state.search.suggestions.error;

export const selectHasSearchResults = (state) =>
  Boolean(state.search.globalSearch.results) ||
  Boolean(state.search.quickLookup.result);

export const selectRecentSearchQueries = (state) =>
  state.search.searchHistory.queries.slice(0, 5);

export const selectRecentLookups = (state) =>
  state.search.searchHistory.lookups.slice(0, 5);

export default searchSlice.reducer;
