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
import { formatCurrency, formatDate } from '../utils/formatters';

const PassengerDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { transactionNumber } = useParams();

  const { passengerHistory } = useAppSelector((state) => state.customers);
  const { loading, data, error } = passengerHistory;

  // Load passenger history on mount
  React.useEffect(() => {
    if (transactionNumber) {
      dispatch(fetchPassengerHistory(transactionNumber));
    }
  }, [dispatch, transactionNumber]);

  const handleBack = () => navigate(-1);

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
          Back
        </Button>
        <Alert severity="error">Error loading passenger details: {error}</Alert>
      </Box>
    );
  }

  if (!data?.passenger) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="warning">Passenger not found</Alert>
      </Box>
    );
  }

  const passenger = data.passenger;
  const currentTrip = data.currentTrip || {};
  const itineraries = currentTrip.itinerary || [];
  const payments = currentTrip.payments || [];
  const tickets = currentTrip.tickets || [];

  // Basic derived data
  const totalTrips = 1 + (data.otherTrips?.length || 0);
  const totalSpent = payments.reduce((sum, p) => {
    const match = p.FPIN?.match(/(\d+(\.\d+)?)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);

  const averageSpent = totalTrips > 0 ? totalSpent / totalTrips : 0;

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
              Passenger Profile
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {passenger.PXNM}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Passenger Info */}
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
                  {passenger.PXNM?.charAt(0)?.toUpperCase() || 'P'}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {passenger.PXNM}
                  </Typography>
                  <Chip label={passenger.PXTP || 'ADT'} sx={{ mt: 1 }} />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ticket Number
                  </Typography>
                  <Typography variant="h6">{passenger.TDNR}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction #
                  </Typography>
                  <Typography variant="h6">{passenger.TRNN}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats */}
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

        {/* Itinerary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Itinerary
              </Typography>

              {itineraries.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Flight</TableCell>
                        <TableCell>Route</TableCell>
                        <TableCell>Departure</TableCell>
                        <TableCell>Arrival</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {itineraries.map((seg, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            {seg.CARR}
                            {seg.FTNR}
                          </TableCell>
                          <TableCell>
                            {seg.ORAC} → {seg.DSTC}
                          </TableCell>
                          <TableCell>
                            {seg.FTDA} {seg.FTDT}
                          </TableCell>
                          <TableCell>{seg.NADA}</TableCell>
                          <TableCell>
                            <Chip
                              label={seg.FBST || 'OK'}
                              color="success"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No itinerary data available</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Payments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Payments
              </Typography>

              {payments.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Payment Info</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.map((p, i) => {
                        const match = p.FPIN?.match(/(\d+(\.\d+)?)/);
                        const amount = match ? parseFloat(match[1]) : 0;
                        return (
                          <TableRow key={i}>
                            <TableCell>{p.FPSN}</TableCell>
                            <TableCell>{p.FPIN}</TableCell>
                            <TableCell align="right">
                              <Typography color="success.main" fontWeight={600}>
                                {formatCurrency(amount)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No payment data available</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PassengerDetails;
