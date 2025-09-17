// src/components/layout/TopBar.jsx - Fixed syntax error
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

// Hooks
import { useAppDispatch, selectUIState } from '../../hooks/redux';
import {
  toggleDarkMode,
  setSearchQuery,
  addToSearchHistory,
} from '../../store/slices/uiSlice';

const TopBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Use memoized selector
  const { darkMode, notifications, searchQuery } = useSelector(selectUIState);

  // Menu states
  const [accountMenuAnchor, setAccountMenuAnchor] = React.useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState(null);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/transactions') return 'Transactions';
    if (path.startsWith('/transactions/')) return 'Transaction Details';
    if (path.startsWith('/tickets/')) return 'Ticket Details';
    if (path === '/analytics') return 'Analytics';
    if (path === '/offices') return 'Offices';
    if (path.startsWith('/offices/')) return 'Office Details';
    if (path === '/passengers') return 'Passengers';
    if (path.startsWith('/passengers/')) return 'Passenger Details';
    if (path === '/reports') return 'Reports';
    if (path === '/upload') return 'File Upload';
    if (path === '/error-logs') return 'Error Logs';
    if (path.startsWith('/error-logs/')) return 'Error Log Details';
    if (path === '/search') return 'Search';
    if (path === '/settings') return 'Settings';
    if (path === '/help') return 'Help';
    return 'HOT22 Manager';
  };

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value;
      if (query.trim()) {
        dispatch(setSearchQuery(query));
        dispatch(
          addToSearchHistory({ query, timestamp: new Date().toISOString() })
        );
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar>
        {/* Page Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
          {getPageTitle()}
        </Typography>

        {/* Search */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
          <TextField
            size="small"
            placeholder="Search..."
            defaultValue={searchQuery}
            onKeyPress={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.25),
                },
              },
            }}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton color="inherit" onClick={handleDarkModeToggle}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationsOpen}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Account Menu */}
          <Tooltip title="Account">
            <IconButton color="inherit" onClick={handleAccountMenuOpen}>
              <AccountIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Account Menu */}
        <Menu
          anchorEl={accountMenuAnchor}
          open={Boolean(accountMenuAnchor)}
          onClose={handleAccountMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              handleAccountMenuClose();
              navigate('/settings');
            }}
          >
            <SettingsIcon sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleAccountMenuClose}>
            <LogoutIcon sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {notifications.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2">No notifications</Typography>
            </MenuItem>
          ) : (
            notifications.slice(0, 5).map((notification, index) => (
              <MenuItem key={index} onClick={handleNotificationsClose}>
                <Box>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
