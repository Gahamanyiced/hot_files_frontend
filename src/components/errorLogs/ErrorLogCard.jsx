// src/components/errorLogs/ErrorLogCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Checkbox,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Schedule as ProcessingIcon,
  Visibility as ViewIcon,
  FileDownload as DownloadIcon,
  Description as FileIcon,
} from '@mui/icons-material';

// Utils
import { formatFileSize, formatNumber } from '../../utils/formatters';

const ErrorLogCard = ({
  errorLog,
  selected = false,
  onSelect,
  onClick,
  onDownload,
}) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <SuccessIcon />;
      case 'failed':
        return <ErrorIcon />;
      case 'processing':
        return <ProcessingIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const handleCardClick = (event) => {
    // Don't trigger if clicking on interactive elements
    if (event.target.closest('button') || event.target.closest('input')) {
      return;
    }
    onClick?.();
  };

  const handleSelectClick = (event) => {
    event.stopPropagation();
    onSelect?.();
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: selected
          ? `2px solid ${theme.palette.primary.main}`
          : '1px solid transparent',
        backgroundColor: selected
          ? alpha(theme.palette.primary.main, 0.05)
          : 'background.paper',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header with selection and file info */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Checkbox
            checked={selected}
            onChange={handleSelectClick}
            onClick={(e) => e.stopPropagation()}
            size="small"
            color="primary"
          />
          <Box sx={{ flex: 1, ml: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FileIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                noWrap
                sx={{ flex: 1 }}
                title={errorLog.fileName}
              >
                {errorLog.fileName || 'Unknown File'}
              </Typography>
            </Box>
            {errorLog.fileSize && (
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(errorLog.fileSize)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Status */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={
              errorLog.status?.charAt(0).toUpperCase() +
                errorLog.status?.slice(1) || 'Unknown'
            }
            color={getStatusColor(errorLog.status)}
            size="small"
            icon={getStatusIcon(errorLog.status)}
            sx={{ fontWeight: 'medium' }}
          />
        </Box>

        {/* Metrics - Using actual API response fields */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Total Processed
            </Typography>
            <Typography variant="h6" color="primary">
              {formatNumber(errorLog.totalProcessed || 0)}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Errors
            </Typography>
            <Typography
              variant="h6"
              color={errorLog.totalErrors > 0 ? 'error.main' : 'success.main'}
            >
              {formatNumber(errorLog.totalErrors || 0)}
            </Typography>
          </Box>
        </Box>

        {/* Processing Time - if available */}
        {errorLog.processingTime && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Processing Time
            </Typography>
            <Typography variant="body2">{errorLog.processingTime}ms</Typography>
          </Box>
        )}

        {/* Error Summary - Only if errorsByType exists in API response */}
        {errorLog.totalErrors > 0 && errorLog.errorsByType && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Error Types
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {Object.entries(errorLog.errorsByType)
                .slice(0, 3)
                .map(([type, errors]) => (
                  <Chip
                    key={type}
                    label={`${type}: ${errors.totalErrors || errors}`}
                    size="small"
                    variant="outlined"
                    color="error"
                  />
                ))}
              {Object.keys(errorLog.errorsByType).length > 3 && (
                <Chip
                  label={`+${Object.keys(errorLog.errorsByType).length - 3}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        {onDownload && (
          <Tooltip title="Download Details">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(errorLog);
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="View Details">
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ErrorLogCard;
