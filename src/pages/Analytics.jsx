import React from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  FlightTakeoff as FlightIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  fetchRevenueAnalytics,
  fetchCommissionAnalytics,
  fetchPerformanceMetrics,
  fetchTravelPatterns,
  setSelectedTab,
  setDateRange,
  setGroupBy,
  setCurrency,
} from '../store/slices/analyticsSlice';

// Components
import MetricCard from '../components/dashboard/MetricCard';
import ChartCard from '../components/dashboard/ChartCard';

const Analytics = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  const {
    revenueAnalytics,
    commissionAnalytics,
    performanceMetrics,
    travelPatterns,
    filters,
    ui,
  } = useAppSelector((state) => state.analytics);

  // Load analytics data on component mount
  React.useEffect(() => {
    dispatch(fetchRevenueAnalytics(filters));
    dispatch(fetchCommissionAnalytics(filters));
    dispatch(fetchPerformanceMetrics(filters));
    dispatch(fetchTravelPatterns(filters));
  }, [dispatch, filters]);

  const handleTabChange = (event, newValue) => {
    dispatch(setSelectedTab(newValue));
  };

  const handleRefresh = () => {
    switch (ui.selectedTab) {
      case 0:
        dispatch(fetchRevenueAnalytics(filters));
        break;
      case 1:
        dispatch(fetchCommissionAnalytics(filters));
        break;
      case 2:
        dispatch(fetchPerformanceMetrics(filters));
        break;
      case 3:
        dispatch(fetchTravelPatterns(filters));
        break;
      default:
        break;
    }
  };

  const handleDateRangeChange = (field, value) => {
    dispatch(setDateRange({
      ...filters.dateRange,
      [field]: value,
    }));
  };

  // Sample data for charts (replace with real data from API)
  const revenueData = [
    { name: 'Jan', revenue: 450000, fare: 380000, tax: 70000 },
    { name: 'Feb', revenue: 520000, fare: 440000, tax: 80000 },
    { name: 'Mar', revenue: 480000, fare: 400000, tax: 80000 },
    { name: 'Apr', revenue: 580000, fare: 490000, tax: 90000 },
    { name: 'May', revenue: 630000, fare: 530000, tax: 100000 },
    { name: 'Jun', revenue: 590000, fare: 500000, tax: 90000 },
  ];

  const commissionData = [
    { name: 'Jan', commission: 25000, rate: 5.5 },
    { name: 'Feb', commission: 28000, rate: 5.4 },
    { name: 'Mar', commission: 26000, rate: 5.4 },
    { name: 'Apr', commission: 32000, rate: 5.5 },
    { name: 'May', commission: 35000, rate: 5.6 },
    { name: 'Jun', commission: 33000, rate: 5.6 },
  ];

  const performanceData = [
    { name: 'Office A', transactions: 1200, revenue: 180000 },
    { name: 'Office B', transactions: 980, revenue: 145000 },
    { name: 'Office C', transactions: 850, revenue: 128000 },
    { name: 'Office D', transactions: 720, revenue: 110000 },
    { name: 'Office E', transactions: 650, revenue: 95000 },
  ];

  const travelPatternsData = [
    { name: 'Domestic', value: 45, color: theme.palette.primary.main },
    { name: 'International', value: 35, color: theme.palette.secondary.main },
    { name: 'Charter', value: 20, color: theme.palette.success.main },
  ];

  const routeData = [
    { route: 'NYC-LAX', passengers: 2500, revenue: 450000 },
    { route: 'NYC-MIA', passengers: 2100, revenue: 380000 },
    { route: 'LAX-SFO', passengers: 1900, revenue: 280000 },
    { route: 'CHI-NYC', passengers: 1800, revenue: 320000 },
    { route: 'BOS-DC', passengers: 1600, revenue: 240000 },
  ];

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Analytics Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Date Range Filters */}
          <DatePicker
            label="Start Date"
            value={filters.dateRange.startDate}
            onChange={(value) => handleDateRangeChange('startDate', value)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            value={filters.dateRange.endDate}
            onChange={(value) => handleDateRangeChange('endDate', value)}
            slotProps={{ textField: { size: 'small' } }}
          />
          
          {/* Group By */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Group By</InputLabel>
            <Select
              value={filters.groupBy}
              label="Group By"
              onChange={(e) => dispatch(setGroupBy(e.target.value))}
            >
              <MenuItem value="day">Daily</MenuItem>
              <MenuItem value="week">Weekly</MenuItem>
              <MenuItem value="month">Monthly</MenuItem>
            </Select>
          </FormControl>
          
          {/* Currency */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={filters.currency}
              label="Currency"
              onChange={(e) => dispatch(setCurrency(e.target.value))}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Analytics Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={ui.selectedTab} onChange={handleTabChange}>
          <Tab 
            label="Revenue Analytics" 
            icon={<MoneyIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Commission Analytics" 
            icon={<TrendingUpIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Performance Metrics" 
            icon={<AssessmentIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Travel Patterns" 
            icon={<FlightIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Revenue Analytics Tab */}
      <TabPanel value={ui.selectedTab} index={0}>
        <Grid container spacing={3}>
          {/* Revenue Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Revenue"
              value="$2,250,000"
              change="+12.5%"
              trend="up"
              icon={MoneyIcon}
              color="primary"
              loading={revenueAnalytics.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Ticket Value"
              value="$485"
              change="+5.2%"
              trend="up"
              icon={TrendingUpIcon}
              color="success"
              loading={revenueAnalytics.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Fare Amount"
              value="$1,890,000"
              change="+8.1%"
              trend="up"
              icon={MoneyIcon}
              color="info"
              loading={revenueAnalytics.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Tax & Fees"
              value="$360,000"
              change="+15.3%"
              trend="up"
              icon={AssessmentIcon}
              color="warning"
              loading={revenueAnalytics.loading}
            />
          </Grid>

          {/* Revenue Trend Chart */}
          <Grid item xs={12} lg={8}>
            <ChartCard title="Revenue Trend" height={400} loading={revenueAnalytics.loading}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke={theme.palette.primary.main} 
                    fill={theme.palette.primary.main}
                    name="Total Revenue"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="fare" 
                    stackId="2"
                    stroke={theme.palette.secondary.main} 
                    fill={theme.palette.secondary.main}
                    name="Fare Amount"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Revenue by Office */}
          <Grid item xs={12} lg={4}>
            <ChartCard title="Revenue by Office" height={400} loading={revenueAnalytics.loading}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData.slice(0, 5)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Commission Analytics Tab */}
      <TabPanel value={ui.selectedTab} index={1}>
        <Grid container spacing={3}>
          {/* Commission Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Commission"
              value="$179,000"
              change="+8.7%"
              trend="up"
              icon={TrendingUpIcon}
              color="success"
              loading={commissionAnalytics.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Rate"
              value="5.5%"
              change="+0.2%"
              trend="up"
              icon={AssessmentIcon}
              color="info"
              loading={commissionAnalytics.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Commission Ratio"
              value="7.95%"
              change="+0.5%"
              trend="up"
              icon={TrendingUpIcon}
              color="primary"
              loading={commissionAnalytics.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Top Performer"
              value="Office A"
              subtitle="$35,000 commission"
              icon={AssessmentIcon}
              color="warning"
              loading={commissionAnalytics.loading}
            />
          </Grid>

          {/* Commission Trend */}
          <Grid item xs={12}>
            <ChartCard title="Commission Analysis" height={400} loading={commissionAnalytics.loading}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commissionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="commission" 
                    fill={theme.palette.primary.main}
                    name="Commission Amount ($)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="rate" 
                    stroke={theme.palette.secondary.main}
                    strokeWidth={3}
                    name="Commission Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Performance Metrics Tab */}
      <TabPanel value={ui.selectedTab} index={2}>
        <Grid container spacing={3}>
          {/* Performance Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Transactions"
              value="4,400"
              change="+18.2%"
              trend="up"
              icon={AssessmentIcon}
              color="primary"
              loading={performanceMetrics.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Active Offices"
              value="25"
              change="+2"
              trend="up"
              icon={TrendingUpIcon}
              color="success"
              loading={performanceMetrics.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Avg Transactions/Office"
              value="176"
              change="+12.1%"
              trend="up"
              icon={AssessmentIcon}
              color="info"
              loading={performanceMetrics.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Growth Rate"
              value="15.8%"
              change="+3.2%"
              trend="up"
              icon={TrendingUpIcon}
              color="warning"
              loading={performanceMetrics.loading}
            />
          </Grid>

          {/* Office Performance Chart */}
          <Grid item xs={12}>
            <ChartCard title="Office Performance Comparison" height={400} loading={performanceMetrics.loading}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="transactions" 
                    fill={theme.palette.primary.main}
                    name="Transactions"
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="revenue" 
                    fill={theme.palette.secondary.main}
                    name="Revenue ($)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Travel Patterns Tab */}
      <TabPanel value={ui.selectedTab} index={3}>
        <Grid container spacing={3}>
          {/* Travel Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Routes"
              value="156"
              change="+8"
              trend="up"
              icon={FlightIcon}
              color="primary"
              loading={travelPatterns.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Popular Route"
              value="NYC-LAX"
              subtitle="2,500 passengers"
              icon={FlightIcon}
              color="success"
              loading={travelPatterns.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Load Factor"
              value="78.5%"
              change="+2.1%"
              trend="up"
              icon={AssessmentIcon}
              color="info"
              loading={travelPatterns.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="International %"
              value="35%"
              change="+5%"
              trend="up"
              icon={FlightIcon}
              color="warning"
              loading={travelPatterns.loading}
            />
          </Grid>

          {/* Travel Distribution */}
          <Grid item xs={12} md={6}>
            <ChartCard title="Travel Type Distribution" height={400} loading={travelPatterns.loading}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={travelPatternsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {travelPatternsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Top Routes */}
          <Grid item xs={12} md={6}>
            <ChartCard title="Top Routes by Revenue" height={400} loading={travelPatterns.loading}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="route" type="category" width={80} />
                  <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Analytics;