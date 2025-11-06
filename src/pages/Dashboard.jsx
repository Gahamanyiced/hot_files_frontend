// src/pages/Dashboard.jsx - Updated to match new API structure
import React from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Receipt as TransactionIcon,
  Business as OfficeIcon,
  Language as CurrencyIcon,
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
  setAllCurrencies,
} from '../store/slices/dashboardSlice';
import { addNotification } from '../store/slices/uiSlice';

// Components
import MetricCard from '../components/dashboard/MetricCard';
import ChartCard from '../components/dashboard/ChartCard';
import TopOfficesCard from '../components/dashboard/TopOfficesCard';
import RecentTransactionsCard from '../components/dashboard/RecentTransactionsCard';
import FilesSummaryCard from '../components/dashboard/FilesSummaryCard';
import CurrencyBreakdownCard from '../components/dashboard/CurrencyBreakdownCard';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatCompactNumber,
} from '../utils/formatters';

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { executiveDashboard, settings, widgets } = useAppSelector(
    (state) => state.dashboard
  );

  const { loading, data, error, lastUpdated } = executiveDashboard;

  // Load dashboard data on mount and when filters change
  React.useEffect(() => {
    const params = {
      startDate: settings.dateRange.startDate,
      endDate: settings.dateRange.endDate,
      currency: settings.currency,
      allCurrencies: settings.allCurrencies,
    };
    dispatch(fetchExecutiveDashboard(params));
  }, [dispatch, settings.dateRange, settings.currency, settings.allCurrencies]);

  // Auto-refresh functionality
  React.useEffect(() => {
    if (!settings.autoRefresh) return;

    const interval = setInterval(() => {
      const params = {
        startDate: settings.dateRange.startDate,
        endDate: settings.dateRange.endDate,
        currency: settings.currency,
        allCurrencies: settings.allCurrencies,
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
      allCurrencies: settings.allCurrencies,
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
    // Convert Date to YYMMDD format
    const formatDateToAPI = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const yy = String(d.getFullYear()).slice(-2);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yy}${mm}${dd}`;
    };

    dispatch(
      setDateRange({
        ...settings.dateRange,
        [field]: formatDateToAPI(value),
      })
    );
  };

  const handleCurrencyChange = (event) => {
    dispatch(setCurrency(event.target.value));
  };

  const handleAllCurrenciesToggle = (event) => {
    dispatch(setAllCurrencies(event.target.checked));
  };

  // Helper functions to extract data based on mode
  const getOverviewData = () => {
    if (!data?.overview) return null;

    const isMultiCurrency = data.mode === 'multi-currency';

    if (isMultiCurrency) {
      return {
        totalTransactions: data.overview.totalTransactions || 0,
        totalRevenue: data.overview.totalRevenue?.grandTotal || {},
        totalCommission: data.overview.totalCommission?.grandTotal || {},
        currency: data.overview.targetCurrency || settings.currency,
        isMultiCurrency: true,
        breakdown: {
          revenue: data.overview.totalRevenue?.breakdown || [],
          commission: data.overview.totalCommission?.breakdown || [],
        },
      };
    } else {
      return {
        totalTransactions: data.overview.totalTransactions || 0,
        totalRevenue: data.overview.totalRevenue || {},
        totalCommission: data.overview.totalCommission || {},
        currency: data.overview.currency || settings.currency,
        isMultiCurrency: false,
      };
    }
  };

  const overview = getOverviewData();

  // Transform topOffices data to match TopOfficesCard expected format
  const getTopOfficesData = () => {
    if (!data?.topOffices) return [];

    return data.topOffices.map((office) => ({
      agentCode: office._id || office.AGTN,
      transactionCount: office.transactionCount || 0,
      totalRevenue: office.totalRevenue || 0,
      location:
        office.officeInfo?.[0]?.MLOC || office.location || 'Unknown Location',
      lastTransaction: office.lastTransaction,
    }));
  };

  // Prepare chart data
  const getCurrencyBreakdownChart = () => {
    if (!overview?.isMultiCurrency || !overview.breakdown) return [];

    return overview.breakdown.revenue.map((item) => ({
      name: item.currency,
      value: item.converted.totalAmount || 0,
      original: item.original.totalAmount || 0,
      color: getCurrencyColor(item.currency),
    }));
  };

  const getCurrencyColor = (currency) => {
    const colors = {
      USD: theme.palette.primary.main,
      EUR: theme.palette.secondary.main,
      XAF: theme.palette.success.main,
      GBP: theme.palette.warning.main,
      CAD: theme.palette.info.main,
    };
    return colors[currency] || theme.palette.grey[500];
  };

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
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Executive Dashboard
          </Typography>
          {overview?.isMultiCurrency && (
            <Chip
              label="Multi-Currency Mode"
              color="info"
              size="small"
              icon={<CurrencyIcon />}
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {/* Date Range Filters */}
          <DatePicker
            label="Start Date"
            value={
              settings.dateRange.startDate
                ? new Date(
                    `20${settings.dateRange.startDate.slice(
                      0,
                      2
                    )}-${settings.dateRange.startDate.slice(
                      2,
                      4
                    )}-${settings.dateRange.startDate.slice(4, 6)}`
                  )
                : null
            }
            onChange={(value) => handleDateRangeChange('startDate', value)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            value={
              settings.dateRange.endDate
                ? new Date(
                    `20${settings.dateRange.endDate.slice(
                      0,
                      2
                    )}-${settings.dateRange.endDate.slice(
                      2,
                      4
                    )}-${settings.dateRange.endDate.slice(4, 6)}`
                  )
                : null
            }
            onChange={(value) => handleDateRangeChange('endDate', value)}
            slotProps={{ textField: { size: 'small' } }}
          />

          {/* Currency Selector */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={settings.currency}
              label="Currency"
              onChange={handleCurrencyChange}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="XAF">XAF</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
              <MenuItem value="CAD">CAD</MenuItem>
            </Select>
          </FormControl>

          {/* Multi-Currency Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.allCurrencies}
                onChange={handleAllCurrenciesToggle}
                color="primary"
              />
            }
            label="All Currencies"
          />

          {/* Refresh Button */}
          <Tooltip title="Refresh Dashboard">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Last Updated & Period Info */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {lastUpdated && (
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </Typography>
        )}
        {data?.period && (
          <Typography variant="body2" color="text.secondary">
            • Period:{' '}
            {data.period.startDate
              ? formatDate(data.period.startDate)
              : 'All time'}
            {data.period.endDate
              ? ` to ${formatDate(data.period.endDate)}`
              : ''}
          </Typography>
        )}
        {data?.mode && (
          <Typography variant="body2" color="text.secondary">
            • Mode: {data.mode}
          </Typography>
        )}
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {widgets.totalTransactions && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Transactions"
              value={formatNumber(overview?.totalTransactions || 0)}
              icon={TransactionIcon}
              color="primary"
              loading={loading}
            />
          </Grid>
        )}

        {widgets.totalRevenue && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={
                overview?.isMultiCurrency
                  ? 'Total Revenue (Converted)'
                  : 'Total Revenue'
              }
              value={formatCurrency(
                overview?.totalRevenue?.totalAmount || 0,
                overview?.currency
              )}
              subtitle={
                overview?.isMultiCurrency
                  ? `Target: ${overview.currency}`
                  : undefined
              }
              icon={MoneyIcon}
              color="success"
              loading={loading}
            />
          </Grid>
        )}

        {widgets.totalCommission && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={
                overview?.isMultiCurrency
                  ? 'Total Commission (Converted)'
                  : 'Total Commission'
              }
              value={formatCurrency(
                overview?.totalCommission?.totalCommission || 0,
                overview?.currency
              )}
              subtitle={`Avg Rate: ${(
                overview?.totalCommission?.avgCommissionRate || 0
              ).toFixed(2)}%`}
              icon={TrendingUpIcon}
              color="info"
              loading={loading}
            />
          </Grid>
        )}

        {widgets.topOffices && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Top Offices"
              value={formatNumber(data?.topOffices?.length || 0)}
              subtitle="Active performers"
              icon={OfficeIcon}
              color="warning"
              loading={loading}
            />
          </Grid>
        )}
      </Grid>

      {/* Detailed Revenue Metrics */}
      {overview && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Total Fare"
              value={formatCurrency(
                overview.totalRevenue?.totalFare || 0,
                overview.currency
              )}
              subtitle="Base fare amount"
              color="primary"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Total Tax"
              value={formatCurrency(
                overview.totalRevenue?.totalTax || 0,
                overview.currency
              )}
              subtitle="Tax collected"
              color="secondary"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Effective Commission"
              value={formatCurrency(
                overview.totalCommission?.effectiveCommissionTotal || 0,
                overview.currency
              )}
              subtitle={`Rate: ${(
                overview.totalCommission?.avgCommissionRate || 0
              ).toFixed(2)}%`}
              color="success"
              loading={loading}
            />
          </Grid>
        </Grid>
      )}

      {/* Currency Breakdown Tables (Multi-Currency Only) */}
      {overview?.isMultiCurrency && overview.breakdown && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={6}>
            <CurrencyBreakdownCard
              breakdown={overview.breakdown.revenue}
              targetCurrency={overview.currency}
              loading={loading}
              title="Revenue by Currency"
              type="revenue"
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <CurrencyBreakdownCard
              breakdown={overview.breakdown.commission}
              targetCurrency={overview.currency}
              loading={loading}
              title="Commission by Currency"
              type="commission"
            />
          </Grid>
        </Grid>
      )}

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {widgets.topOffices && (
          <Grid item xs={12} md={6}>
            <TopOfficesCard
              data={getTopOfficesData()}
              loading={loading}
              title="Top Performing Offices"
            />
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

      {/* Currency Charts (Multi-Currency Only) - COMMENTED FOR LATER USE */}
      {/* TODO: Uncomment when needed
      {overview?.isMultiCurrency && overview.breakdown && getCurrencyBreakdownChart().length > 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <ChartCard title="Revenue by Currency (Converted)" loading={loading} height={400}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={getCurrencyBreakdownChart()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name"
                    style={{ fontSize: '14px' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCompactNumber(value)}
                    style={{ fontSize: '12px' }}
                  />
                  <RechartsTooltip
                    formatter={(value, name) => [
                      formatCurrency(value, overview.currency),
                      'Converted Amount',
                    ]}
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '4px',
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={theme.palette.primary.main}
                    radius={[8, 8, 0, 0]}
                  >
                    {getCurrencyBreakdownChart().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <ChartCard title="Currency Distribution" loading={loading} height={400}>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={getCurrencyBreakdownChart()}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{
                      stroke: theme.palette.text.primary,
                      strokeWidth: 1,
                    }}
                  >
                    {getCurrencyBreakdownChart().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(value, overview.currency)}
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '4px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      )}
      */}
    </Box>
  );
};

export default Dashboard;
