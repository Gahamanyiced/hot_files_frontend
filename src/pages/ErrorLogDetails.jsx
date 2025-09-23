// src/pages/ErrorLogDetails.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
  useTheme,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  Assessment as StatsIcon,
  Schedule as TimeIcon,
  Storage as DataIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  fetchErrorLogDetails,
  clearSelectedErrorLog,
} from '../store/slices/errorLogsSlice';
import { addNotification } from '../store/slices/uiSlice';

// Components
import LoadingOverlay from '../components/common/LoadingOverlay';
import MetricCard from '../components/dashboard/MetricCard';
import ValidationErrorsList from '../components/errorLogs/ValidationErrorsList';

// Utils
import {
  formatFileSize,
  formatDate,
  formatDuration,
  formatNumber,
} from '../utils/formatters';
import ErrorsByTypeSection from '../components/errorLogs/ErrorsByTypeSection';

const ErrorLogDetails = () => {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { selectedErrorLog } = useAppSelector((state) => state.errorLogs);
  const { data, loading, error } = selectedErrorLog;

  // Load error log details on component mount
  React.useEffect(() => {
    if (uploadId) {
      dispatch(fetchErrorLogDetails(uploadId));
    }

    return () => {
      dispatch(clearSelectedErrorLog());
    };
  }, [dispatch, uploadId]);

  const handleRefresh = () => {
    if (uploadId) {
      dispatch(fetchErrorLogDetails(uploadId));
      dispatch(
        addNotification({
          type: 'info',
          message: 'Error log details refreshed',
          autoHideDuration: 2000,
        })
      );
    }
  };

  const handleDownload = () => {
    // Implementation for downloading error details
    dispatch(
      addNotification({
        type: 'info',
        message: 'Downloading error log details...',
      })
    );
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

  const getErrorTypeIcon = (errorType) => {
    switch (errorType) {
      case 'validation':
        return <WarningIcon color="warning" />;
      case 'save':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load error log details: {error.message || error}
        </Alert>
        <Button
          onClick={() => navigate('/error-logs')}
          startIcon={<BackIcon />}
        >
          Back to Error Logs
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Error log not found
        </Alert>
        <Button
          onClick={() => navigate('/error-logs')}
          startIcon={<BackIcon />}
        >
          Back to Error Logs
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/error-logs')}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1">
              Error Log Details
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                File Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      File Name
                    </Typography>
                    <Typography variant="h6">{data.fileName}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={
                        data.status.charAt(0).toUpperCase() +
                        data.status.slice(1)
                      }
                      color={getStatusColor(data.status)}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Upload Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(data.uploadedAt)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      File Size
                    </Typography>
                    <Typography variant="body1">
                      {formatFileSize(data.fileSize)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Processing Time
                    </Typography>
                    <Typography variant="body1">
                      {formatDuration(data.processingTime)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MetricCard
                title="Total Processed"
                value={formatNumber(data.totalProcessed)}
                icon={DataIcon}
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Total Saved"
                value={formatNumber(data.totalSaved)}
                icon={StatsIcon}
                color="success"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Total Errors"
                value={formatNumber(data.totalErrors)}
                icon={ErrorIcon}
                color="error"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Processing Progress */}
      {data.totalProcessed > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Processing Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">Success Rate</Typography>
                <Typography variant="body2">
                  {((data.totalSaved / data.totalProcessed) * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(data.totalSaved / data.totalProcessed) * 100}
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">Error Rate</Typography>
                <Typography variant="body2">
                  {((data.totalErrors / data.totalProcessed) * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(data.totalErrors / data.totalProcessed) * 100}
                color="error"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Errors by Type */}
      {data && <ErrorsByTypeSection initialData={data} />}
    </Box>
  );
};

export default ErrorLogDetails;
