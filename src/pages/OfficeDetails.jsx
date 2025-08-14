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
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  useTheme,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchOfficeDetails } from '../store/slices/officeSlice';

// Components
import MetricCard from '../components/dashboard/MetricCard';
import ChartCard from '../components/dashboard/ChartCard';

// Utils
import { formatCurrency, formatNumber, formatDate, formatAgentCode } from '../utils/formatters';

const OfficeDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { agentCode } = useParams();

  const { officeDetails } = useAppSelector((state) => state.offices);
  const { loading, data: office, error } = officeDetails;

  // Load office details on component mount
  React.useEffect(() => {
    if (agentCode) {
      dispatch(fetchOfficeDetails(agentCode));
    }
  }, [dispatch, agentCode]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewTransactions = () => {
    navigate(`/transactions?agentCode=${agentCode}`);
  };

  const handleViewPassengers = () => {
    navigate(`/passengers?agentCode=${agentCode}`);
  };

  // Sample data for charts (replace with real data from API)
  const performanceData = [
    { month: 'Jan', transactions: 120, revenue: 18000 },
    { month: 'Feb', transactions: 135, revenue: 21000 },
    { month: 'Mar', transactions: 128, revenue: 19500 },
    { month: 'Apr', transactions: 160, revenue: 24000 },
    { month: 'May', transactions: 175, revenue: 26500 },
    { month: 'Jun', transactions: 165, revenue: 25000 },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 18000 },
    { month: 'Feb', revenue: 21000 },
    { month: 'Mar', revenue: 19500 },
    { month: 'Apr', revenue: 24000 },
    { month: 'May', revenue: 26500 },
    { month: 'Jun', revenue: 25000 },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Offices
        </Button>
        <Alert severity="error">
          Error loading office details: {error}
        </Alert>
      </Box>
    );
  }

  if (!office) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Offices
        </Button>
        <Alert severity="warning">
          Office not found
        </Alert>
      </Box>
    );
  }

  const performanceScore = 85; // Calculate based on office metrics

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Office Details
            </Typography>
            <Typography variant="h6" color="text.secondary" fontFamily="monospace">
              {formatAgentCode(agentCode)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={handleViewTransactions}>
            View Transactions
          </Button>
          <Button variant="contained" onClick={handleViewPassengers}>
            View Passengers
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Office Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: theme.palette.primary.main,
                    mr: 3,
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight={600}>
                    Agent Code: {formatAgentCode(office.AGTN)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {office.stats?.officeTotals?.MLOC || 'Office Location'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label="Active" color="success" size="small" />
                    <Chip 
                      label={`Performance: ${performanceScore}%`} 
                      color={performanceScore > 80 ? 'success' : performanceScore > 60 ? 'warning' : 'error'}
                      size="small" 
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Office Information */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {office.stats?.officeTotals?.MLOC || 'Not specified'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Agent Code
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {formatAgentCode(office.AGTN)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Currency
                      </Typography>
                      <Typography variant="body1">
                        {office.CUTP || 'USD'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Activity
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(office.RMED)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Performance Score */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Performance Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={performanceScore}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: performanceScore > 80 ? theme.palette.success.main :
                                     performanceScore > 60 ? theme.palette.warning.main :
                                     theme.palette.error.main,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {performanceScore}% - Based on transaction volume, revenue, and efficiency
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MetricCard
                title="Total Transactions"
                value={formatNumber(office.stats?.transactionCount || 0)}
                icon={PeopleIcon}
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(office.stats?.totalRevenue || 0)}
                icon={MoneyIcon}
                color="success"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Avg Transaction"
                value={formatCurrency((office.stats?.totalRevenue || 0) / (office.stats?.transactionCount || 1))}
                icon={TrendingUpIcon}
                color="info"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Performance Charts */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Monthly Performance" height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="transactions" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Revenue Trend" height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={theme.palette.success.main}
                  strokeWidth={3}
                  dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activity
              </Typography>

              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Processing transactions"
                    secondary="Last activity 2 hours ago"
                  />
                  <Chip label="Active" color="success" size="small" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Monthly report generated"
                    secondary="3 days ago"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Settings updated"
                    secondary="1 week ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Metrics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Key Performance Indicators
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Transaction Volume</Typography>
                    <Typography variant="body2" fontWeight={500}>95%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={95} color="success" />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Revenue Growth</Typography>
                    <Typography variant="body2" fontWeight={500}>78%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={78} color="primary" />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Customer Satisfaction</Typography>
                    <Typography variant="body2" fontWeight={500}>82%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={82} color="warning" />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Efficiency Score</Typography>
                    <Typography variant="body2" fontWeight={500}>88%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={88} color="info" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OfficeDetails;