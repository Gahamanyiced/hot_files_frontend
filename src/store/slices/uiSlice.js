import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Layout
  sidebarOpen: true,
  sidebarWidth: 280,
  
  // Theme
  darkMode: false,
  primaryColor: '#1976d2',
  
  // Loading states
  globalLoading: false,
  loadingMessage: '',
  
  // Notifications
  notifications: [],
  
  // Modals and Dialogs
  modals: {
    uploadFile: false,
    transactionDetails: false,
    passengerDetails: false,
    officeDetails: false,
  },
  
  // Current selections
  selectedItems: {
    transactions: [],
    passengers: [],
    offices: [],
  },
  
  // View preferences
  viewPreferences: {
    transactionsView: 'table', // 'table' | 'cards'
    pageSize: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  
  // Filters
  activeFilters: {
    dateRange: null,
    agentCode: null,
    currency: 'USD',
    status: null,
  },
  
  // Search
  searchQuery: '',
  searchHistory: [],
  
  // Page states
  pageStates: {
    dashboard: {
      refreshInterval: 300000, // 5 minutes
      autoRefresh: true,
    },
    transactions: {
      selectedTab: 0,
      expandedRows: [],
    },
    analytics: {
      chartType: 'line',
      timeRange: '30d',
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Layout actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = action.payload;
    },
    
    // Theme actions
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
    },
    
    // Loading actions
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload.loading;
      state.loadingMessage = action.payload.message || '';
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info',
        autoHideDuration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Modal actions
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modal) => {
        state.modals[modal] = false;
      });
    },
    
    // Selection actions
    setSelectedItems: (state, action) => {
      const { type, items } = action.payload;
      state.selectedItems[type] = items;
    },
    
    toggleSelectedItem: (state, action) => {
      const { type, item } = action.payload;
      const currentItems = state.selectedItems[type];
      const index = currentItems.findIndex((i) => i.id === item.id);
      
      if (index > -1) {
        currentItems.splice(index, 1);
      } else {
        currentItems.push(item);
      }
    },
    
    clearSelectedItems: (state, action) => {
      const type = action.payload;
      state.selectedItems[type] = [];
    },
    
    // View preference actions
    setViewPreference: (state, action) => {
      const { key, value } = action.payload;
      state.viewPreferences[key] = value;
    },
    
    setViewPreferences: (state, action) => {
      state.viewPreferences = { ...state.viewPreferences, ...action.payload };
    },
    
    // Filter actions
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.activeFilters[key] = value;
    },
    
    setFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.activeFilters = initialState.activeFilters;
    },
    
    // Search actions
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    addToSearchHistory: (state, action) => {
      const query = action.payload;
      state.searchHistory = [
        query,
        ...state.searchHistory.filter((q) => q !== query),
      ].slice(0, 10); // Keep last 10 searches
    },
    
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    
    // Page state actions
    setPageState: (state, action) => {
      const { page, key, value } = action.payload;
      if (!state.pageStates[page]) {
        state.pageStates[page] = {};
      }
      state.pageStates[page][key] = value;
    },
    
    setPageStates: (state, action) => {
      const { page, states } = action.payload;
      state.pageStates[page] = { ...state.pageStates[page], ...states };
    },
    
    // Reset actions
    resetUI: () => initialState,
    
    resetPageState: (state, action) => {
      const page = action.payload;
      state.pageStates[page] = initialState.pageStates[page] || {};
    },
  },
});

export const {
  // Layout
  toggleSidebar,
  setSidebarOpen,
  setSidebarWidth,
  
  // Theme
  toggleDarkMode,
  setDarkMode,
  setPrimaryColor,
  
  // Loading
  setGlobalLoading,
  
  // Notifications
  addNotification,
  removeNotification,
  clearNotifications,
  
  // Modals
  openModal,
  closeModal,
  closeAllModals,
  
  // Selections
  setSelectedItems,
  toggleSelectedItem,
  clearSelectedItems,
  
  // View preferences
  setViewPreference,
  setViewPreferences,
  
  // Filters
  setFilter,
  setFilters,
  clearFilters,
  
  // Search
  setSearchQuery,
  addToSearchHistory,
  clearSearchHistory,
  
  // Page states
  setPageState,
  setPageStates,
  
  // Reset
  resetUI,
  resetPageState,
} = uiSlice.actions;

// Selectors
export const selectUI = (state) => state.ui;
export const selectSidebar = (state) => ({
  open: state.ui.sidebarOpen,
  width: state.ui.sidebarWidth,
});
export const selectTheme = (state) => ({
  darkMode: state.ui.darkMode,
  primaryColor: state.ui.primaryColor,
});
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectSelectedItems = (state) => state.ui.selectedItems;
export const selectViewPreferences = (state) => state.ui.viewPreferences;
export const selectActiveFilters = (state) => state.ui.activeFilters;
export const selectSearch = (state) => ({
  query: state.ui.searchQuery,
  history: state.ui.searchHistory,
});
export const selectPageState = (page) => (state) => state.ui.pageStates[page] || {};

export default uiSlice.reducer;