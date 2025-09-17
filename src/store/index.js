// src/store/index.js - Fixed store configuration
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import all slices
import uiSlice from './slices/uiSlice';
import dashboardSlice from './slices/dashboardSlice';
import transactionSlice from './slices/transactionSlice';
import analyticsSlice from './slices/analyticsSlice';
import officeSlice from './slices/officeSlice';
import customerSlice from './slices/customerSlice';
import fileSlice from './slices/fileSlice';
import searchSlice from './slices/searchSlice';
import errorLogsSlice from './slices/errorLogsSlice';

// RTK Query API slices
import { hotFilesApiSlice } from './api/hotFilesApiSlice';
import { errorLogsApiSlice } from './api/errorLogsApiSlice';

export const store = configureStore({
  reducer: {
    // UI state
    ui: uiSlice,
    
    // Feature slices
    dashboard: dashboardSlice,
    transactions: transactionSlice,
    analytics: analyticsSlice,
    offices: officeSlice,
    customers: customerSlice,
    files: fileSlice,
    search: searchSlice,
    errorLogs: errorLogsSlice,
    
    // RTK Query
    [hotFilesApiSlice.reducerPath]: hotFilesApiSlice.reducer,
    [errorLogsApiSlice.reducerPath]: errorLogsApiSlice.reducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          // Ignore RTK Query actions
          'hotFilesApi/executeQuery/pending',
          'hotFilesApi/executeQuery/fulfilled',
          'hotFilesApi/executeQuery/rejected',
          'hotFilesApi/executeMutation/pending',
          'hotFilesApi/executeMutation/fulfilled',
          'hotFilesApi/executeMutation/rejected',
          'errorLogsApi/executeQuery/pending',
          'errorLogsApi/executeQuery/fulfilled',
          'errorLogsApi/executeQuery/rejected',
          'errorLogsApi/executeMutation/pending',
          'errorLogsApi/executeMutation/fulfilled',
          'errorLogsApi/executeMutation/rejected',
        ],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: [
          'files.uploadProgress',
          // Ignore RTK Query internal state
          'hotFilesApi.queries',
          'hotFilesApi.mutations',
          'hotFilesApi.provided',
          'hotFilesApi.subscriptions',
          'hotFilesApi.config',
          'errorLogsApi.queries',
          'errorLogsApi.mutations',
          'errorLogsApi.provided',
          'errorLogsApi.subscriptions',
          'errorLogsApi.config',
          // Ignore cache maps
          'dashboard.cache',
        ],
      },
    })
    .concat(hotFilesApiSlice.middleware)
    .concat(errorLogsApiSlice.middleware),
  
  devTools: import.meta.env.DEV,
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

export default store;