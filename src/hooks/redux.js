// src/hooks/redux.js - Add memoized selectors
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Memoized selectors to prevent unnecessary rerenders
export const selectTheme = createSelector(
  [(state) => state.ui?.darkMode, (state) => state.ui?.primaryColor],
  (darkMode, primaryColor) => ({
    darkMode: darkMode || false,
    primaryColor: primaryColor || '#1976d2',
  })
);

export const selectSidebar = createSelector(
  [(state) => state.ui?.sidebarOpen, (state) => state.ui?.sidebarWidth],
  (sidebarOpen, sidebarWidth) => ({
    open: sidebarOpen !== undefined ? sidebarOpen : true,
    width: sidebarWidth || 280,
  })
);

export const selectNotifications = createSelector(
  [(state) => state.ui?.notifications],
  (notifications) => notifications || []
);

export const selectUIState = createSelector(
  [
    (state) => state.ui?.darkMode,
    (state) => state.ui?.primaryColor,
    (state) => state.ui?.sidebarOpen,
    (state) => state.ui?.notifications,
    (state) => state.ui?.searchQuery,
  ],
  (darkMode, primaryColor, sidebarOpen, notifications, searchQuery) => ({
    darkMode: darkMode || false,
    primaryColor: primaryColor || '#1976d2',
    sidebarOpen: sidebarOpen !== undefined ? sidebarOpen : true,
    notifications: notifications || [],
    searchQuery: searchQuery || '',
  })
);