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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  ConfirmationNumber as TicketIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
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
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatAgentCode,
} from '../utils/formatters';

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

  // Transform transaction history for chart
  const getTransactionChartData = () => {
    if (!office?.transactionHistory) return [];

    return office.transactionHistory
      .map((item) => ({
        date: formatDate(item._id),
        transactions: item.transactionCount,
        tickets: item.uniqueTickets?.length || 0,
      }))
      .reverse(); // Reverse to show chronological order
  };

  // Calculate totals from transaction history
  const getTotalTransactions = () => {
    if (!office?.transactionHistory) return 0;
    return office.transactionHistory.reduce(
      (sum, item) => sum + item.transactionCount,
      0
    );
  };

  const getTotalTickets = () => {
    if (!office?.transactionHistory) return 0;
    return office.transactionHistory.reduce(
      (sum, item) => sum + (item.uniqueTickets?.length || 0),
      0
    );
  };

  // Parse GROS (gross amount) from officeTotals
  const parseAmount = (amountStr) => {
    if (!amountStr) return 0;
    // Remove special characters and convert to number
    const cleanStr = amountStr.replace(/[{}\s]/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num / 100; // Divide by 100 as amounts are in cents
  };

  const getGrossAmount = () => {
    return parseAmount(office?.officeTotals?.GROS);
  };

  const getCommissionAmount = () => {
    return parseAmount(office?.officeTotals?.TCOM);
  };

  const getAveragePerTransaction = () => {
    const total = getTotalTransactions();
    return total > 0 ? getGrossAmount() / total : 0;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
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
        <Alert severity="error">Error loading office details: {error}</Alert>
      </Box>
    );
  }

  if (!office) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Offices
        </Button>
        <Alert severity="warning">Office not found</Alert>
      </Box>
    );
  }

  const totalTransactions = getTotalTransactions();
  const totalTickets = getTotalTickets();
  const grossAmount = getGrossAmount();
  const performanceScore =
    totalTransactions > 0 ? Math.min(100, totalTransactions / 10) : 0; // Simple calculation

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Office Details
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              fontFamily="monospace"
            >
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
                    Agent Code:{' '}
                    {formatAgentCode(office.officeInfo?.AGTN || agentCode)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {office.officeInfo?.MLOC ||
                      office.officeTotals?.MLOC ||
                      'Office Location'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label="Active" color="success" size="small" />
                    <Chip
                      label={`Performance: ${performanceScore.toFixed(0)}%`}
                      color={
                        performanceScore > 80
                          ? 'success'
                          : performanceScore > 60
                          ? 'warning'
                          : 'error'
                      }
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
                        {office.officeInfo?.MLOC ||
                          office.officeTotals?.MLOC ||
                          'Not specified'}
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
                        {formatAgentCode(office.officeInfo?.AGTN || agentCode)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Currency
                      </Typography>
                      <Typography variant="body1">
                        {office.officeInfo?.CUTP?.replace(/\d+$/, '') ||
                          office.officeTotals?.CUTP?.replace(/\d+$/, '') ||
                          'USD'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Activity
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(
                          office.officeInfo?.RMED || office.officeTotals?.RMED
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Message Type
                      </Typography>
                      <Typography variant="body1">
                        {office.officeInfo?.SMSG || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Transaction Type
                      </Typography>
                      <Typography variant="body1">
                        {office.officeTotals?.TRNC || 'Standard'}
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
                      backgroundColor:
                        performanceScore > 80
                          ? theme.palette.success.main
                          : performanceScore > 60
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {performanceScore.toFixed(0)}% - Based on transaction volume
                  and activity
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
                value={formatNumber(totalTransactions)}
                icon={PeopleIcon}
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Unique Tickets"
                value={formatNumber(totalTickets)}
                icon={TicketIcon}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Gross Amount"
                value={formatCurrency(grossAmount)}
                icon={MoneyIcon}
                color="success"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Avg Transaction"
                value={formatCurrency(getAveragePerTransaction())}
                icon={TrendingUpIcon}
                color="info"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Transaction History Chart */}
        <Grid item xs={12}>
          <ChartCard title="Transaction History" height={350}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getTransactionChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Bar
                  dataKey="transactions"
                  fill={theme.palette.primary.main}
                  name="Transactions"
                />
                <Bar
                  dataKey="tickets"
                  fill={theme.palette.secondary.main}
                  name="Tickets"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Transaction History Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Transaction History by Date
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Transactions</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Unique Tickets</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {office.transactionHistory?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(item._id)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={formatNumber(item.transactionCount)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(item.uniqueTickets?.length || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Office Totals Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Financial Summary
              </Typography>

              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Gross Amount"
                    secondary="Total gross revenue"
                  />
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(getGrossAmount())}
                  </Typography>
                </ListItem>
                <Divider />

                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Commission"
                    secondary="Total commission earned"
                  />
                  <Typography variant="h6" color="primary.main">
                    {formatCurrency(getCommissionAmount())}
                  </Typography>
                </ListItem>
                <Divider />

                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Average per Transaction"
                    secondary="Based on total transactions"
                  />
                  <Typography variant="h6" color="info.main">
                    {formatCurrency(getAveragePerTransaction())}
                  </Typography>
                </ListItem>
                <Divider />

                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Total Transactions"
                    secondary="All processed transactions"
                  />
                  <Chip
                    label={formatNumber(totalTransactions)}
                    color="primary"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Activity Summary
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography
                      variant="h4"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {formatNumber(totalTransactions)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Transactions
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography
                      variant="h4"
                      color="secondary.main"
                      fontWeight="bold"
                    >
                      {formatNumber(totalTickets)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unique Tickets
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography
                      variant="h4"
                      color="success.main"
                      fontWeight="bold"
                    >
                      {office.transactionHistory?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Days
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography
                      variant="h4"
                      color="warning.main"
                      fontWeight="bold"
                    >
                      {totalTransactions > 0
                        ? (totalTickets / totalTransactions).toFixed(1)
                        : '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tickets per Transaction
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OfficeDetails;
