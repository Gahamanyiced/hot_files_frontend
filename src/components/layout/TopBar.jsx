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
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import {
  toggleDarkMode,
  setSearchQuery,
  addToSearchHistory,
  addNotification,
} from '../../store/slices/uiSlice';

const TopBar = ({ onSidebarToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { darkMode, searchQuery, notifications, sidebarOpen } = useAppSelector(
    (state) => ({
      darkMode: state.ui.darkMode,
      searchQuery: state.ui.searchQuery,
      notifications: state.ui.notifications,
      sidebarOpen: state.ui.sidebarOpen,
    })
  );

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
    if (path === '/search') return 'Search';
    if (path === '/settings') return 'Settings';
    if (path === '/help') return 'Help';
    return 'HOT22 Airlines';
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      dispatch(addToSearchHistory(searchQuery.trim()));
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
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

  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
    dispatch(
      addNotification({
        type: 'info',
        message: `Switched to ${darkMode ? 'light' : 'dark'} mode`,
        autoHideDuration: 2000,
      })
    );
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleUpload = () => {
    navigate('/upload');
  };

  const handleSettings = () => {
    navigate('/settings');
    handleAccountMenuClose();
  };

  const handleLogout = () => {
    // Simple logout - just show notification for now
    dispatch(
      addNotification({
        type: 'info',
        message: 'Logout functionality coming soon',
      })
    );
    handleAccountMenuClose();
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {/* Menu Button */}
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onSidebarToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {getPageTitle()}
        </Typography>

        {/* Search Bar */}
        <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search transactions, passengers, offices..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.25),
                },
                borderRadius: 2,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Upload Button */}
          <Tooltip title="Upload HOT22 File">
            <IconButton color="inherit" onClick={handleUpload}>
              <UploadIcon />
            </IconButton>
          </Tooltip>

          {/* Refresh Button */}
          <Tooltip title="Refresh Data">
            <IconButton color="inherit" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationsOpen}>
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Account Menu */}
          <Tooltip title="Account">
            <IconButton color="inherit" onClick={handleAccountMenuOpen}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Account Menu */}
        <Menu
          anchorEl={accountMenuAnchor}
          open={Boolean(accountMenuAnchor)}
          onClose={handleAccountMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleAccountMenuClose}>
            <AccountIcon sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <SettingsIcon sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 },
          }}
        >
          {notifications.length === 0 ? (
            <MenuItem>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </MenuItem>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={handleNotificationsClose}
              >
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="subtitle2" noWrap>
                      {notification.title || 'Notification'}
                    </Typography>
                    <Chip
                      label={notification.type}
                      size="small"
                      color={
                        notification.type === 'error' ? 'error' : 'primary'
                      }
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {notification.message}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
          {notifications.length > 5 && (
            <MenuItem onClick={() => navigate('/notifications')}>
              <Typography variant="body2" color="primary">
                View all notifications
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
