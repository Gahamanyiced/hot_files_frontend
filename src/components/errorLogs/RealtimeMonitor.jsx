// src/components/errorLogs/RealtimeMonitor.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Chip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Error as ErrorIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Hooks
import { useGetRealtimeMonitoringQuery } from '../../store/api/errorLogsApiSlice';

// Components
import MetricCard from '../dashboard/MetricCard';

const RealtimeMonitor = ({ enabled, interval, onToggle, onIntervalChange }) => {
  const theme = useTheme();

  // Fetch real-time data
  const {
    data: realtimeData,
    isLoading,
    error,
  } = useGetRealtimeMonitoringQuery(
    {
      interval,
      metrics: 'errorRate,uploadCount,processingTime',
    },
    {
      skip: !enabled,
      pollingInterval: interval * 1000, // Convert to milliseconds
    }
  );

  const intervalOptions = [
    { value: 5, label: '5 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' },
  ];

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.high) return 'error';
    if (value >= thresholds.medium) return 'warning';
    return 'success';
  };

  return (
    <Box>
      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Real-time Monitoring</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Refresh Interval</InputLabel>
                <Select
                  value={interval}
                  label="Refresh Interval"
                  onChange={(e) => onIntervalChange(e.target.value)}
                  disabled={!enabled}
                >
                  {intervalOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {enabled ? 'Enabled' : 'Disabled'}
                </Typography>
                <Switch checked={enabled} onChange={onToggle} color="primary" />
              </Box>
            </Box>
          </Box>

          {!enabled && (
            <Alert severity="info">
              Enable real-time monitoring to track upload performance and error
              rates in real-time.
            </Alert>
          )}

          {enabled && error && (
            <Alert severity="error">
              Failed to fetch real-time data: {error.message}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      {enabled && realtimeData?.data && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Upload Count"
                value={realtimeData.data.uploadCount}
                icon={UploadIcon}
                color="primary"
                loading={isLoading}
                subtitle={`Last ${interval}s`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Error Rate"
                value={`${realtimeData.data.errorRate}%`}
                icon={ErrorIcon}
                color={getStatusColor(parseFloat(realtimeData.data.errorRate), {
                  high: 10,
                  medium: 5,
                })}
                loading={isLoading}
                subtitle={`Last ${interval}s`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Avg Processing Time"
                value={`${realtimeData.data.processingTime?.average || 0}ms`}
                icon={SpeedIcon}
                color={getStatusColor(
                  realtimeData.data.processingTime?.average || 0,
                  { high: 5000, medium: 2000 }
                )}
                loading={isLoading}
                subtitle={`Last ${interval}s`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Max Processing Time"
                value={`${realtimeData.data.processingTime?.maximum || 0}ms`}
                icon={TrendingUpIcon}
                color={getStatusColor(
                  realtimeData.data.processingTime?.maximum || 0,
                  { high: 10000, medium: 5000 }
                )}
                loading={isLoading}
                subtitle={`Last ${interval}s`}
              />
            </Grid>
          </Grid>

          {/* Real-time Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upload Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={realtimeData.data.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="periodStart"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleTimeString()
                        }
                      />
                      <YAxis />
                      <RechartsTooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleString()
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="uploads"
                        stroke={theme.palette.primary.main}
                        fill={theme.palette.primary.main}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Error Rate Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={realtimeData.data.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="periodStart"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleTimeString()
                        }
                      />
                      <YAxis />
                      <RechartsTooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleString()
                        }
                        formatter={(value) => [`${value}%`, 'Error Rate']}
                      />
                      <Line
                        type="monotone"
                        dataKey="errorRate"
                        stroke={theme.palette.error.main}
                        strokeWidth={2}
                        dot={{ fill: theme.palette.error.main }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default RealtimeMonitor;
