// src/components/layout/Sidebar.jsx - Updated with hamburger menu toggle
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as TransactionsIcon,
  Analytics as AnalyticsIcon,
  Business as OfficesIcon,
  People as PassengersIcon,
  Assessment as ReportsIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  ExpandLess,
  ExpandMore,
  Error as ErrorIcon,
  BugReport as ErrorLogsIcon,
  Menu as MenuIcon, // Add hamburger menu icon
  MenuOpen as MenuOpenIcon, // Add open menu icon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

// Hooks
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const DRAWER_WIDTH = 280;

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
  },
  {
    id: 'data-management',
    label: 'Data Management',
    icon: TransactionsIcon,
    children: [
      {
        id: 'transactions',
        label: 'Transactions',
        icon: TransactionsIcon,
        path: '/transactions',
      },
      {
        id: 'offices',
        label: 'Offices',
        icon: OfficesIcon,
        path: '/offices',
      },
      {
        id: 'passengers',
        label: 'Passengers',
        icon: PassengersIcon,
        path: '/passengers',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: AnalyticsIcon,
    path: '/analytics',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: ReportsIcon,
    path: '/reports',
  },
  {
    id: 'file-management',
    label: 'File Management',
    icon: UploadIcon,
    children: [
      {
        id: 'upload',
        label: 'File Upload',
        icon: UploadIcon,
        path: '/upload',
      },
      {
        id: 'error-logs',
        label: 'Error Logs',
        icon: ErrorLogsIcon,
        path: '/error-logs',
      },
    ],
  },
  {
    id: 'search',
    label: 'Search',
    icon: SearchIcon,
    path: '/search',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    path: '/settings',
  },
  {
    id: 'help',
    label: 'Help',
    icon: HelpIcon,
    path: '/help',
  },
];

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const [expandedItems, setExpandedItems] = React.useState({
    'data-management': true,
    'file-management': true,
  });

  const handleSidebarToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  const handleItemClick = (item) => {
    if (item.children) {
      setExpandedItems((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    } else if (item.path) {
      navigate(item.path);
      // Close sidebar on mobile
      if (window.innerWidth < theme.breakpoints.values.md) {
        dispatch(setSidebarOpen(false));
      }
    }
  };

  const isItemActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const isParentActive = (children) => {
    return children?.some((child) => isItemActive(child.path));
  };

  const renderNavigationItem = (item, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isActive = item.path
      ? isItemActive(item.path)
      : isParentActive(item.children);

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              pl: 2 + level * 2,
              backgroundColor:
                isActive && !hasChildren ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive ? 'primary.main' : 'text.secondary',
                minWidth: 40,
              }}
            >
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'primary.main' : 'text.primary',
                },
              }}
            />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) =>
                renderNavigationItem(child, level + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* Header with Logo and Hamburger Menu */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ textAlign: 'left', flex: 1 }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            HOT22 Manager
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Airlines Data Management
          </Typography>
        </Box>

        {/* Hamburger Menu Toggle */}
        <Tooltip title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}>
          <IconButton
            onClick={handleSidebarToggle}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 2 }}>
        {navigationItems.map((item) => renderNavigationItem(item))}
      </List>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Version 1.0.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
