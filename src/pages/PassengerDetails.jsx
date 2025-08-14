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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Person as PersonIcon,
  Flight as FlightIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchPassengerHistory } from '../store/slices/customerSlice';

// Components
import MetricCard from '../components/dashboard/MetricCard';

// Utils
import { formatCurrency, formatDate, formatPassengerName, formatTicketNumber } from '../utils/formatters';

const PassengerDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { transactionNumber } = useParams();

  const { passengerHistory } = useAppSelector((state) => state.customers);
  const { loading, data: passenger, error } = passengerHistory;

  // Load passenger history on component mount
  React.useEffect(() => {
    if (transactionNumber) {
      dispatch(fetchPassengerHistory(transactionNumber));
    }
  }, [dispatch, transactionNumber]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewTransaction = (trnn) => {
    navigate(`/transactions/${trnn}`);
  };

  const handleViewTicket = (ticketNumber) => {
    navigate(`/tickets/${ticketNumber}`);
  };

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
          Back to Passengers
        </Button>
        <Alert severity="error">
          Error loading passenger details: {error}
        </Alert>
      </Box>
    );
  }

  if (!passenger) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Passengers
        </Button>
        <Alert severity="warning">
          Passenger not found
        </Alert>
      </Box>
    );
  }

  // Calculate travel statistics
  const totalTrips = passenger.travelHistory?.length || 0;
  const totalSpent = passenger.travelHistory?.reduce((sum, trip) => sum + (trip.amount || 0), 0) || 0;
  const averageSpent = totalTrips > 0 ? totalSpent / totalTrips : 0;
  const lastTravelDate = passenger.travelHistory?.[0]?.date || null;

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
              Passenger Profile
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {formatPassengerName(passenger.name)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => handleViewTransaction(passenger.lastTransaction)}>
            View Latest Transaction
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Passenger Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: theme.palette.secondary.main,
                    mr: 3,
                    fontSize: '2rem',
                  }}
                >
                  {passenger.name?.charAt(0)?.toUpperCase() || 'P'}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" fontWeight={600}>
                    {formatPassengerName(passenger.name)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip 
                      label={passenger.type || 'ADT'} 
                      color={passenger.type === 'CHD' ? 'warning' : 'default'}
                    />
                    <Chip 
                      label={`${totalTrips} trips`} 
                      color="primary" 
                      variant="outlined"
                    />
                    {totalTrips >= 10 && (
                      <Chip 
                        label="Frequent Traveler" 
                        color="success"
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Passenger Information */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Passenger Type
                  </Typography>
                  <Typography variant="h6">
                    {passenger.type === 'ADT' ? 'Adult' : 
                     passenger.type === 'CHD' ? 'Child' : 
                     passenger.type === 'INF' ? 'Infant' : 
                     'Adult'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Customer Since
                  </Typography>
                  <Typography variant="h6">
                    {formatDate(passenger.firstTravelDate)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Last Travel
                  </Typography>
                  <Typography variant="h6">
                    {lastTravelDate ? formatDate(lastTravelDate) : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Primary Currency
                  </Typography>
                  <Typography variant="h6">
                    {passenger.preferredCurrency || 'USD'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Travel Statistics */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MetricCard
                title="Total Trips"
                value={totalTrips.toString()}
                icon={FlightIcon}
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Total Spent"
                value={formatCurrency(totalSpent)}
                icon={MoneyIcon}
                color="success"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Average per Trip"
                value={formatCurrency(averageSpent)}
                icon={TrendingUpIcon}
                color="info"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Travel History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Travel History
                </Typography>
                <Chip 
                  label={`${totalTrips} trips`} 
                  color="primary" 
                  variant="outlined"
                />
              </Box>

              {passenger.travelHistory && passenger.travelHistory.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Transaction</TableCell>
                        <TableCell>Ticket Number</TableCell>
                        <TableCell>Route</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {passenger.travelHistory.slice(0, 10).map((trip, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            {formatDate(trip.date)}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              TXN-{trip.transactionNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {formatTicketNumber(trip.ticketNumber)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FlightIcon fontSize="small" color="primary" />
                              <Typography variant="body2">
                                {trip.route || 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={500} color="success.main">
                              {formatCurrency(trip.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={trip.status || 'Completed'} 
                              color={trip.status === 'Refunded' ? 'error' : 'success'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Transaction">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewTransaction(trip.transactionNumber)}
                                >
                                  <ReceiptIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Ticket">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewTicket(trip.ticketNumber)}
                                >
                                  <FlightIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <HistoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No travel history available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This passenger hasn't made any trips yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>

              <List>
                <ListItem button onClick={() => handleViewTransaction(passenger.lastTransaction)} sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <ReceiptIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="View Latest Transaction"
                    secondary={`TXN-${passenger.lastTransaction}`}
                  />
                </ListItem>

                <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Schedule Follow-up"
                    secondary="Create a reminder for this passenger"
                  />
                </ListItem>

                <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <HistoryIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Export Travel History"
                    secondary="Download complete travel record"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Travel Patterns */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Travel Patterns
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Preferred Destinations
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {passenger.preferredDestinations?.map((dest, index) => (
                      <Chip key={index} label={dest} size="small" variant="outlined" />
                    )) || <Typography variant="body2">No data available</Typography>}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Travel Frequency
                  </Typography>
                  <Typography variant="body1">
                    {totalTrips === 0 ? 'No trips' :
                     totalTrips < 3 ? 'Occasional traveler' :
                     totalTrips < 10 ? 'Regular traveler' :
                     'Frequent traveler'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Average Trip Value
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(averageSpent)}
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

export default PassengerDetails;