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
          // Ignore RTK Query actions that contain non-serializable values
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
          // Ignore error logs actions
          'errorLogs/fetchErrorLogs/pending',
          'errorLogs/fetchErrorLogs/fulfilled',
          'errorLogs/fetchErrorLogs/rejected',
          'errorLogs/fetchErrorStats/pending',
          'errorLogs/fetchErrorStats/fulfilled',
          'errorLogs/fetchErrorStats/rejected',
          // Ignore RTK Query internal actions
          'errorLogsApi/config/middlewareRegistered',
          'hotFilesApi/config/middlewareRegistered',
          '__rtkq/focused',
          '__rtkq/unfocused',
        ],
        ignoredActionsPaths: [
          'meta.arg', 
          'payload.timestamp',
          'meta.baseQueryMeta',
          'meta.fulfilledTimeStamp',
          'meta.arg.signal',
          'meta.arg.abort',
          'payload.config',
          'payload.request',
        ],
        ignoredPaths: [
          'files.uploadProgress',
          // Ignore RTK Query internal state paths
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
          // Ignore cache maps that contain non-serializable values
          'dashboard.cache',
          'transactions.cache',
          'transactions.cache.transactions',
          'analytics.cache',
          'offices.cache',
          'customers.cache',
          'files.cache',
          'search.cache',
          'errorLogs.cache',
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