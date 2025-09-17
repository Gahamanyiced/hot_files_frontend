// src/components/errorLogs/ErrorLogStats.jsx - Traditional Redux version
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Traditional Redux actions and selectors
import {
  fetchErrorStats,
  selectErrorStats,
  selectErrorStatsLoading,
} from '../../store/slices/errorLogSlice';

// Components
import MetricCard from '../dashboard/MetricCard';

// Utils
import { formatNumber, formatDuration } from '../../utils/formatters';

const ErrorLogStats = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { data: stats, loading, error } = useSelector(selectErrorStats);

  const COLORS = [
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.info.main,
  ];

  // Load stats on component mount
  React.useEffect(() => {
    dispatch(fetchErrorStats({ days: 30 }));
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load error statistics: {error.message || error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="warning">
        No statistics data available
      </Alert>
    );
  }

  // Prepare chart data
  const dailyTrendsData = stats.dailyTrends?.map(trend => ({
    date: new Date(trend._id).toLocaleDateString(),
    uploads: trend.uploads,
    errors: trend.errors,
    processed: trend.processed,
    errorRate: trend.errors > 0 ? ((trend.errors / trend.processed) * 100).toFixed(2) : 0,
  })) || [];

  const statusData = [
    { name: 'Completed', value: stats.completedUploads, color: COLORS[2] },
    { name: 'Failed', value: stats.failedUploads, color: COLORS[0] },
    { name: 'With Errors', value: stats.uploadsWithErrors, color: COLORS[1] },
  ];

  const processingSummary = [
    {
      label: 'Average Processing Time',
      value: formatDuration(stats.avgProcessingTime),
      icon: <ScheduleIcon />,
      color: 'info',
    },
    {
      label: 'Maximum Processing Time',
      value: formatDuration(stats.maxProcessingTime),
      icon: <TrendingUpIcon />,
      color: 'warning',
    },
    {
      label: 'Minimum Processing Time',
      value: formatDuration(stats.minProcessingTime),
      icon: <TrendingDownIcon />,
      color: 'success',
    },
  ];

  return (
    <Box>
      {/* Overview Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Uploads"
            value={formatNumber(stats.totalUploads)}
            icon={<AssessmentIcon />}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={<SuccessIcon />}
            color="success"
            trend={parseFloat(stats.successRate) > 90 ? 'up' : 'down'}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Error Rate"
            value={`${stats.errorRate}%`}
            icon={<ErrorIcon />}
            color="error"
            trend={parseFloat(stats.errorRate) > 5 ? 'up' : 'down'}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Errors"
            value={formatNumber(stats.totalErrors)}
            icon={<ErrorIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Daily Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Trends (Last 30 Days)
              </Typography>
              
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'errorRate' ? `${value}%` : formatNumber(value),
                        name === 'uploads' ? 'Uploads' : 
                        name === 'errors' ? 'Errors' : 
                        name === 'processed' ? 'Processed' : 'Error Rate'
                      ]}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="uploads"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      name="uploads"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="errors"
                      stroke={theme.palette.error.main}
                      strokeWidth={2}
                      name="errors"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="errorRate"
                      stroke={theme.palette.warning.main}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="errorRate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Status Distribution
              </Typography>
              
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatNumber(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Statistics */}
      <Grid container spacing={3}>
        {/* Processing Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Processing Performance
              </Typography>
              
              <List>
                {processingSummary.map((item, index) => (
                  <React.Fragment key={item.label}>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ 
                          color: theme.palette[item.color].main, 
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {item.icon}
                        </Box>
                        <ListItemText
                          primary={item.label}
                          secondary={item.value}
                          secondaryTypographyProps={{
                            variant: 'h6',
                            color: 'text.primary',
                          }}
                        />
                      </Box>
                    </ListItem>
                    {index < processingSummary.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatNumber(stats.totalProcessedRecords)}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {stats.completedUploads}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completed Uploads
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {stats.failedUploads}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Failed Uploads
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Rate Analysis */}
      {dailyTrendsData.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Error Rate Analysis
            </Typography>
            
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}%`,
                      'Error Rate'
                    ]}
                  />
                  <Bar 
                    dataKey="errorRate" 
                    fill={theme.palette.warning.main}
                    name="errorRate"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Analysis:</strong> The error rate chart shows daily error percentages. 
                A consistent error rate below 5% indicates good data quality, while spikes 
                may indicate issues with specific file formats or validation rules.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ErrorLogStats;