import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Receipt as TransactionIcon,
  Business as OfficeIcon,
  DateRange as DateIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  fetchExecutiveDashboard,
  setDateRange,
  setCurrency,
  toggleWidget,
} from '../store/slices/dashboardSlice';
import { addNotification } from '../store/slices/uiSlice';

// Components
import DashboardCard from '../components/dashboard/DashboardCard';
import MetricCard from '../components/dashboard/MetricCard';
import ChartCard from '../components/dashboard/ChartCard';
import TopOfficesCard from '../components/dashboard/TopOfficesCard';
import RecentTransactionsCard from '../components/dashboard/RecentTransactionsCard';
import FilesSummaryCard from '../components/dashboard/FilesSummaryCard';

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { executiveDashboard, settings, widgets } = useAppSelector(
    (state) => state.dashboard
  );

  console.log('executive', executiveDashboard);

  const { loading, data, error, lastUpdated } = executiveDashboard;

  // Load dashboard data on mount
  React.useEffect(() => {
    const params = {
      startDate: settings.dateRange.startDate,
      endDate: settings.dateRange.endDate,
      currency: settings.currency,
    };
    dispatch(fetchExecutiveDashboard(params));
  }, [dispatch, settings.dateRange, settings.currency]);

  // Auto-refresh functionality
  React.useEffect(() => {
    if (!settings.autoRefresh) return;

    const interval = setInterval(() => {
      const params = {
        startDate: settings.dateRange.startDate,
        endDate: settings.dateRange.endDate,
        currency: settings.currency,
      };
      dispatch(fetchExecutiveDashboard(params));
    }, settings.refreshInterval);

    return () => clearInterval(interval);
  }, [dispatch, settings]);

  const handleRefresh = () => {
    const params = {
      startDate: settings.dateRange.startDate,
      endDate: settings.dateRange.endDate,
      currency: settings.currency,
    };
    dispatch(fetchExecutiveDashboard(params));
    dispatch(
      addNotification({
        type: 'info',
        message: 'Dashboard refreshed',
        autoHideDuration: 2000,
      })
    );
  };

  const handleDateRangeChange = (field, value) => {
    dispatch(
      setDateRange({
        ...settings.dateRange,
        [field]: value,
      })
    );
  };

  // Sample data for charts (replace with real data from API)
  const revenueChartData = [
    { name: 'Jan', revenue: 65000, transactions: 1200 },
    { name: 'Feb', revenue: 72000, transactions: 1350 },
    { name: 'Mar', revenue: 68000, transactions: 1280 },
    { name: 'Apr', revenue: 85000, transactions: 1600 },
    { name: 'May', revenue: 92000, transactions: 1750 },
    { name: 'Jun', revenue: 88000, transactions: 1650 },
  ];

  const commissionChartData = [
    { name: 'Office A', commission: 8500 },
    { name: 'Office B', commission: 7200 },
    { name: 'Office C', commission: 6800 },
    { name: 'Office D', commission: 5900 },
    { name: 'Office E', commission: 4500 },
  ];

  const pieChartData = [
    { name: 'Domestic', value: 45, color: theme.palette.primary.main },
    { name: 'International', value: 35, color: theme.palette.secondary.main },
    { name: 'Charter', value: 20, color: theme.palette.success.main },
  ];

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading dashboard data: {error.message || 'Unknown error'}
        </Alert>
        <Button variant="contained" onClick={handleRefresh}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Executive Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Date Range Filters */}
          <DatePicker
            label="Start Date"
            value={settings.dateRange.startDate}
            onChange={(value) => handleDateRangeChange('startDate', value)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            value={settings.dateRange.endDate}
            onChange={(value) => handleDateRangeChange('endDate', value)}
            slotProps={{ textField: { size: 'small' } }}
          />

          {/* Refresh Button */}
          <Tooltip title="Refresh Dashboard">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Last Updated */}
      {lastUpdated && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </Typography>
      )}

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {widgets.totalTransactions && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Transactions"
              value={data?.overview?.totalTransactions || 0}
              change="+12.5%"
              trend="up"
              icon={TransactionIcon}
              color="primary"
              loading={loading}
            />
          </Grid>
        )}

        {widgets.totalRevenue && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Revenue"
              value={`$${(
                data?.overview?.totalRevenue?.totalAmount || 0
              ).toLocaleString()}`}
              change="+8.3%"
              trend="up"
              icon={MoneyIcon}
              color="success"
              loading={loading}
            />
          </Grid>
        )}

        {widgets.totalCommission && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Commission"
              value={`$${(
                data?.overview?.totalCommission?.totalCommission || 0
              ).toLocaleString()}`}
              change="+5.7%"
              trend="up"
              icon={TrendingUpIcon}
              color="info"
              loading={loading}
            />
          </Grid>
        )}

        {widgets.topOffices && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Active Offices"
              value={data?.topOffices?.length || 0}
              change="+2"
              trend="up"
              icon={OfficeIcon}
              color="warning"
              loading={loading}
            />
          </Grid>
        )}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {widgets.revenueChart && (
          <Grid item xs={12} lg={8}>
            <ChartCard title="Revenue Trend" loading={loading}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    dot={{
                      fill: theme.palette.primary.main,
                      strokeWidth: 2,
                      r: 4,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        )}

        <Grid item xs={12} lg={4}>
          <ChartCard title="Transaction Types" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Commission Chart */}
      {widgets.performanceMetrics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <ChartCard title="Top Performing Offices" loading={loading}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={commissionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar
                    dataKey="commission"
                    fill={theme.palette.secondary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      )}

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {widgets.topOffices && (
          <Grid item xs={12} md={6}>
            <TopOfficesCard data={data?.topOffices || []} loading={loading} />
          </Grid>
        )}

        {widgets.recentTransactions && (
          <Grid item xs={12} md={6}>
            <RecentTransactionsCard loading={loading} />
          </Grid>
        )}

        {widgets.filesSummary && (
          <Grid item xs={12}>
            <FilesSummaryCard
              data={data?.filesSummary || []}
              loading={loading}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
