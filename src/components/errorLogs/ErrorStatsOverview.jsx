// src/components/errorLogs/ErrorStatsOverview.jsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as StatsIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Components
import MetricCard from '../dashboard/MetricCard';
import ChartCard from '../dashboard/ChartCard';

// Utils
import { formatNumber, formatDuration } from '../../utils/formatters';

const ErrorStatsOverview = ({ stats, loading, onRefresh }) => {
  const theme = useTheme();

  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No statistics available
        </Typography>
      </Box>
    );
  }

  const pieData = [
    {
      name: 'Completed',
      value: stats.completedUploads,
      color: theme.palette.success.main,
    },
    {
      name: 'Failed',
      value: stats.failedUploads,
      color: theme.palette.error.main,
    },
    {
      name: 'With Errors',
      value: stats.uploadsWithErrors,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">Error Statistics Overview</Typography>
        <Tooltip title="Refresh Statistics">
          <IconButton onClick={onRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Uploads"
            value={formatNumber(stats.totalUploads)}
            icon={StatsIcon}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={SuccessIcon}
            color="success"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Error Rate"
            value={`${stats.errorRate}%`}
            icon={ErrorIcon}
            color="error"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg Processing Time"
            value={formatDuration(stats.avgProcessingTime)}
            icon={TimeIcon}
            color="info"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Upload Status Distribution */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Upload Status Distribution" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Daily Trends */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Daily Upload Trends" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="uploads"
                  stackId="1"
                  stroke={theme.palette.primary.main}
                  fill={theme.palette.primary.main}
                  name="Uploads"
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stackId="2"
                  stroke={theme.palette.error.main}
                  fill={theme.palette.error.main}
                  name="Errors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Detailed Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Processing Statistics
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    Total Records Processed
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatNumber(stats.totalProcessedRecords)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Total Records Saved</Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {formatNumber(stats.totalSavedRecords)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Total Errors</Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="error.main"
                  >
                    {formatNumber(stats.totalErrors)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    Average Processing Time
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatDuration(stats.avgProcessingTime)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    Maximum Processing Time
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="warning.main"
                  >
                    {formatDuration(stats.maxProcessingTime)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    Minimum Processing Time
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {formatDuration(stats.minProcessingTime)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ErrorStatsOverview;
