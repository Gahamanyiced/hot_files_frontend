// src/components/errorLogs/ErrorLogMonitoring.jsx - Traditional Redux version
// ============================================

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Error as ErrorIcon,
  CloudUpload as UploadIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

// Traditional Redux actions and selectors
import {
  fetchRealTimeMonitoring,
  setMonitoringActive,
  setMonitoringInterval,
  addMonitoringData,
  clearMonitoringHistory,
  selectErrorLogsMonitoring,
  selectActiveMonitoring,
} from '../../store/slices/errorLogSlice';

// Components
import MetricCard from '../dashboard/MetricCard';

// Utils
import { formatNumber, formatDuration } from '../../utils/formatters';

const ErrorLogMonitoring = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { 
    data: monitoringData, 
    loading, 
    error, 
    isActive, 
    interval, 
    historicalData 
  } = useSelector(selectErrorLogsMonitoring);

  // Polling interval reference
  const pollingIntervalRef = React.useRef(null);

  // Start/stop monitoring effect
  React.useEffect(() => {
    if (isActive) {
      // Initial fetch
      dispatch(fetchRealTimeMonitoring({ interval, metrics: 'errorRate,uploadCount,processingTime,successRate' }));
      
      // Set up polling
      pollingIntervalRef.current = setInterval(() => {
        dispatch(fetchRealTimeMonitoring({ interval, metrics: 'errorRate,uploadCount,processingTime,successRate' }));
      }, interval * 1000);
    } else {
      // Clear polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [dispatch, isActive, interval]);

  // Update historical data when new monitoring data arrives
  React.useEffect(() => {
    if (monitoringData && isActive) {
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        timestamp: Date.now(),
        errorRate: parseFloat(monitoringData.errorRate || 0),
        uploadCount: monitoringData.uploadCount || 0,
        processingTime: monitoringData.processingTime?.average || 0,
        successRate: 100 - parseFloat(monitoringData.errorRate || 0),
      };

      dispatch(addMonitoringData(newDataPoint));
    }
  }, [monitoringData, isActive, dispatch]);

  const handleToggleMonitoring = () => {
    dispatch(setMonitoringActive(!isActive));
    if (!isActive) {
      dispatch(clearMonitoringHistory());
    }
  };

  const handleIntervalChange = (newInterval) => {
    dispatch(setMonitoringInterval(newInterval));
    dispatch(clearMonitoringHistory());
  };

  const handleRefresh = () => {
    dispatch(fetchRealTimeMonitoring({ interval, metrics: 'errorRate,uploadCount,processingTime,successRate' }));
  };

  const getCurrentMetrics = () => {
    if (!monitoringData) return null;
    
    return {
      uploadCount: monitoringData.uploadCount || 0,
      errorRate: parseFloat(monitoringData.errorRate || 0),
      processingTime: monitoringData.processingTime?.average || 0,
      maxProcessingTime: monitoringData.processingTime?.maximum || 0,
      periodStart: monitoringData.periodStart,
      periodEnd: monitoringData.periodEnd,
    };
  };

  const metrics = getCurrentMetrics();

  const getStatusColor = (errorRate) => {
    if (errorRate < 2) return 'success';
    if (errorRate < 5) return 'warning';
    return 'error';
  };

  const getStatusIcon = (errorRate) => {
    if (errorRate < 2) return <TrendingDownIcon />;
    if (errorRate < 5) return <TimelineIcon />;
    return <TrendingUpIcon />;
  };

  return (
    <Box>
      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant={isActive ? "contained" : "outlined"}
                  color={isActive ? "error" : "primary"}
                  startIcon={isActive ? <PauseIcon /> : <PlayIcon />}
                  onClick={handleToggleMonitoring}
                >
                  {isActive ? 'Stop Monitoring' : 'Start Monitoring'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={!isActive}
                >
                  Refresh
                </Button>
                
                {isActive && (
                  <Chip
                    icon={<CircularProgress size={16} />}
                    label="Live"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Refresh Interval:
                </Typography>
                {[30, 60, 120, 300].map((seconds) => (
                  <Button
                    key={seconds}
                    size="small"
                    variant={interval === seconds ? "contained" : "outlined"}
                    onClick={() => handleIntervalChange(seconds)}
                    disabled={isActive}
                  >
                    {seconds}s
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      {metrics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Upload Count"
              value={formatNumber(metrics.uploadCount)}
              subtitle={`Last ${interval}s`}
              icon={<UploadIcon />}
              color="primary"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Error Rate"
              value={`${metrics.errorRate}%`}
              subtitle={`Status: ${getStatusColor(metrics.errorRate)}`}
              icon={getStatusIcon(metrics.errorRate)}
              color={getStatusColor(metrics.errorRate)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Avg Processing Time"
              value={formatDuration(metrics.processingTime)}
              subtitle={`Max: ${formatDuration(metrics.maxProcessingTime)}`}
              icon={<SpeedIcon />}
              color="info"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Success Rate"
              value={`${(100 - metrics.errorRate).toFixed(1)}%`}
              subtitle="Current period"
              icon={<TrendingUpIcon />}
              color="success"
            />
          </Grid>
        </Grid>
      )}

      {/* Real-time Charts */}
      {historicalData.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Error Rate Trend
                </Typography>
                
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Error Rate']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="errorRate" 
                        stroke={theme.palette.error.main}
                        fill={theme.palette.error.light}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload Activity
                </Typography>
                
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [value, 'Uploads']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="uploadCount" 
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Processing Time Analysis */}
      {historicalData.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Processing Time Analysis
            </Typography>
            
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatDuration(value), 'Processing Time']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="processingTime" 
                    stroke={theme.palette.info.main}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Status Messages */}
      <Box sx={{ mt: 3 }}>
        {!isActive && (
          <Alert severity="info">
            Click "Start Monitoring" to begin real-time error tracking
          </Alert>
        )}
        
        {isActive && !error && !loading && (
          <Alert severity="success">
            Real-time monitoring is active. Data refreshes every {interval} seconds.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error">
            Failed to fetch monitoring data: {error.message || error}
          </Alert>
        )}
        
        {loading && isActive && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">
              Fetching real-time data...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Historical Trends Summary */}
      {monitoringData?.trends && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Historical Trends (Last 24 Hours)
            </Typography>
            
            <Grid container spacing={2}>
              {monitoringData.trends.slice(-6).map((trend, index) => (
                <Grid item xs={12} sm={6} md={2} key={index}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(trend.periodStart).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {trend.uploads}
                    </Typography>
                    <Typography variant="caption">
                      uploads
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(parseFloat(trend.errorRate || 0), 10) * 10}
                      color={getStatusColor(parseFloat(trend.errorRate || 0))}
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {trend.errorRate}% errors
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ErrorLogMonitoring;