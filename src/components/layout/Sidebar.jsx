import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
  useTheme,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as TransactionIcon,
  Analytics as AnalyticsIcon,
  Business as OfficeIcon,
  People as PeopleIcon,
  Assessment as ReportsIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  FlightTakeoff,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const navigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
  },
  {
    id: 'transactions',
    title: 'Transactions',
    icon: TransactionIcon,
    path: '/transactions',
    children: [
      { id: 'all-transactions', title: 'All Transactions', path: '/transactions' },
      { id: 'recent-transactions', title: 'Recent', path: '/transactions?filter=recent' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: AnalyticsIcon,
    path: '/analytics',
    children: [
      { id: 'revenue-analytics', title: 'Revenue', path: '/analytics?tab=revenue' },
      { id: 'commission-analytics', title: 'Commission', path: '/analytics?tab=commission' },
      { id: 'performance-analytics', title: 'Performance', path: '/analytics?tab=performance' },
    ],
  },
  {
    id: 'offices',
    title: 'Offices',
    icon: OfficeIcon,
    path: '/offices',
  },
  {
    id: 'passengers',
    title: 'Passengers',
    icon: PeopleIcon,
    path: '/passengers',
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: ReportsIcon,
    path: '/reports',
  },
  {
    id: 'upload',
    title: 'File Upload',
    icon: UploadIcon,
    path: '/upload',
  },
  {
    id: 'search',
    title: 'Search',
    icon: SearchIcon,
    path: '/search',
  },
];

const bottomNavigationItems = [
  {
    id: 'settings',
    title: 'Settings',
    icon: SettingsIcon,
    path: '/settings',
  },
  {
    id: 'help',
    title: 'Help',
    icon: HelpIcon,
    path: '/help',
  },
];

const Sidebar = ({ open, onToggle, isMobile }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { sidebarWidth } = useAppSelector((state) => ({
    sidebarWidth: state.ui.sidebarWidth,
  }));

  const [expandedItems, setExpandedItems] = React.useState({});

  const handleItemClick = (item) => {
    if (item.children) {
      setExpandedItems(prev => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    } else {
      navigate(item.path);
      if (isMobile) {
        dispatch(setSidebarOpen(false));
      }
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderNavigationItem = (item, isChild = false) => {
    const isActive = isActiveRoute(item.path);
    const isExpanded = expandedItems[item.id];
    const Icon = item.icon;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              pl: isChild ? 4 : 2.5,
              backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
              color: isActive ? theme.palette.primary.contrastText : 'inherit',
              '&:hover': {
                backgroundColor: isActive 
                  ? theme.palette.primary.dark 
                  : theme.palette.action.hover,
              },
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
            }}
          >
            {Icon && (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isActive ? theme.palette.primary.contrastText : 'inherit',
                }}
              >
                <Icon />
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.title}
              sx={{ opacity: open ? 1 : 0 }}
            />
            {item.children && open && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        
        {item.children && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderNavigationItem(child, true))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: theme.spacing(2),
          minHeight: 64,
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlightTakeoff color="primary" />
            <Typography variant="h6" color="primary" fontWeight="bold">
              HOT22
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton onClick={onToggle} size="small">
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1 }}>
        <List>
          {navigationItems.map((item) => renderNavigationItem(item))}
        </List>
      </Box>

      <Divider />

      {/* Bottom Navigation */}
      <Box>
        <List>
          {bottomNavigationItems.map((item) => renderNavigationItem(item))}
        </List>
      </Box>

      {/* User Info */}
      {open && (
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.background.paper,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
              A
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                Administrator
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                admin@hot22.com
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarWidth,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? sidebarWidth : theme.spacing(7),
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: open ? sidebarWidth : theme.spacing(7),
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;