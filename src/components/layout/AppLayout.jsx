// src/components/layout/AppLayout.jsx - Fixed background and layout
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

// Components
import Sidebar from './Sidebar';
import TopBar from './TopBar';

// Hooks
import { selectSidebar } from '../../hooks/redux';

const AppLayout = ({ children }) => {
  const theme = useTheme();
  // Use memoized selector
  const { open: sidebarOpen, width: sidebarWidth } = useSelector(selectSidebar);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          marginLeft: sidebarOpen ? 0 : `-${sidebarWidth}px`,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%',
          backgroundColor: 'background.default', // Remove white background
        }}
      >
        {/* Top Bar */}
        <TopBar />

        {/* Page Content - No additional background */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: 'transparent', // Transparent to inherit from parent
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
