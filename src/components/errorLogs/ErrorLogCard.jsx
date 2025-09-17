// src/components/errorLogs/ErrorLogCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Checkbox,
  Tooltip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Schedule as ProcessingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  formatFileSize,
  formatDate,
  formatNumber,
} from '../../utils/formatters';

const ErrorLogCard = ({ errorLog, selected, onSelect, onClick }) => {
  const theme = useTheme();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <SuccessIcon color="success" fontSize="small" />;
      case 'failed':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'processing':
        return <ProcessingIcon color="warning" fontSize="small" />;
      default:
        return <WarningIcon color="disabled" fontSize="small" />;
    }
  };

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

  const successRate =
    errorLog.totalProcessed > 0
      ? ((errorLog.totalSaved / errorLog.totalProcessed) * 100).toFixed(1)
      : 0;

  return (
    <Card
      sx={{
        height: '100%',
        border: selected
          ? `2px solid ${theme.palette.primary.main}`
          : '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              {errorLog.fileName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="monospace"
            >
              {errorLog.uploadId.substring(0, 8)}...
            </Typography>
          </Box>
          <Checkbox
            checked={selected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            size="small"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Chip
            icon={getStatusIcon(errorLog.status)}
            label={
              errorLog.status.charAt(0).toUpperCase() + errorLog.status.slice(1)
            }
            color={getStatusColor(errorLog.status)}
            size="small"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Uploaded: {formatDate(errorLog.uploadedAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Size: {formatFileSize(errorLog.fileSize)}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Processed: {formatNumber(errorLog.totalProcessed)}
            </Typography>
            <Typography variant="body2">
              Errors: {formatNumber(errorLog.totalErrors)}
            </Typography>
          </Box>

          {errorLog.totalProcessed > 0 && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Typography variant="caption">Success Rate</Typography>
                <Typography variant="caption">{successRate}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={parseFloat(successRate)}
                color={errorLog.totalErrors > 0 ? 'warning' : 'success'}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0 }}>
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation(); /* Handle download */
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ErrorLogCard;
