import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';

const ChartCard = ({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  onRefresh,
  onExport,
  onFullscreen,
  actions = [],
  headerAction,
  height = 400,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const defaultActions = [
    ...(onRefresh
      ? [{ label: 'Refresh', icon: RefreshIcon, onClick: onRefresh }]
      : []),
    ...(onExport
      ? [{ label: 'Export', icon: ExportIcon, onClick: onExport }]
      : []),
    ...(onFullscreen
      ? [{ label: 'Fullscreen', icon: FullscreenIcon, onClick: onFullscreen }]
      : []),
    ...actions,
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="div" fontWeight={600}>
            {title}
          </Typography>
        }
        subheader={
          subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {headerAction}
            {defaultActions.length > 0 && (
              <>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  disabled={loading}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {defaultActions.map((action, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        action.onClick?.();
                        handleMenuClose();
                      }}
                      disabled={action.disabled}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        {action.icon && <action.icon fontSize="small" />}
                        {action.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0, height: height, position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Skeleton variant="rectangular" height="80%" />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rectangular" width="20%" height={20} />
              <Skeleton variant="rectangular" width="15%" height={20} />
              <Skeleton variant="rectangular" width="25%" height={20} />
            </Box>
          </Box>
        ) : error ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography color="error" variant="body2">
              Error loading chart: {error}
            </Typography>
            {onRefresh && (
              <IconButton onClick={onRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            )}
          </Box>
        ) : (
          <Box sx={{ height: '100%', width: '100%' }}>{children}</Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
