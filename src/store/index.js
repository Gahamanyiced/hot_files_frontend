// src/store/index.js
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

// RTK Query API slice
import { hotFilesApiSlice } from './api/hotFilesApiSlice';

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
    
    // RTK Query
    [hotFilesApiSlice.reducerPath]: hotFilesApiSlice.reducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['files.uploadProgress'],
      },
    }).concat(hotFilesApiSlice.middleware),
  
  devTools: import.meta.env.DEV,
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Export types for TypeScript (optional, can be used if you add TypeScript later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
