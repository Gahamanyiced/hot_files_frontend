import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { useAppSelector } from '../../hooks/redux';

const LoadingOverlay = () => {
  const theme = useTheme();
  const { globalLoading, loadingMessage } = useAppSelector((state) => state.ui);

  if (!globalLoading) {
    return null;
  }

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme.zIndex.modal + 1,
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(4px)',
      }}
      open={globalLoading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          p: 4,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          boxShadow: theme.shadows[8],
          minWidth: 300,
          textAlign: 'center',
        }}
      >
        {/* Loading Spinner */}
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
          }}
        />

        {/* Loading Message */}
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: theme.palette.text.primary,
              mb: 1,
              fontWeight: 500,
            }}
          >
            {loadingMessage || 'Loading...'}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Please wait while we process your request
          </Typography>

          {/* Indeterminate Progress Bar */}
          <LinearProgress
            sx={{
              borderRadius: 1,
              height: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: 1,
              },
            }}
          />
        </Box>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;