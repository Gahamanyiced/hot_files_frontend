import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';

// Components
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';

// Hooks
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const dispatch = useAppDispatch();
  const { sidebarOpen, sidebarWidth } = useAppSelector((state) => ({
    sidebarOpen: state.ui.sidebarOpen,
    sidebarWidth: state.ui.sidebarWidth,
  }));

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (isMobile && sidebarOpen) {
      dispatch(setSidebarOpen(false));
    }
  }, [isMobile, dispatch]);

  const handleSidebarToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        isMobile={isMobile}
      />
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: isMobile ? 0 : (sidebarOpen ? 0 : `-${sidebarWidth}px`),
          minHeight: '100vh',
        }}
      >
        {/* Top Bar */}
        <TopBar onSidebarToggle={handleSidebarToggle} />
        
        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            padding: theme.spacing(3),
            backgroundColor: theme.palette.background.default,
            minHeight: 'calc(100vh - 64px)', // Subtract top bar height
          }}
        >
          <Outlet />
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer - 1,
          }}
          onClick={handleSidebarToggle}
        />
      )}
    </Box>
  );
};

export default AppLayout;