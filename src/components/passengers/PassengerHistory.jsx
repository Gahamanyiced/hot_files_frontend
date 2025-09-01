// src/components/passengers/PassengerHistory.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Chip,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Flight as FlightIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  LocalAirport as AirportIcon,
} from '@mui/icons-material';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatTime,
  formatPassengerName,
  formatTicketNumber,
} from '../../utils/formatters';

const PassengerHistory = ({ passenger, history = [], loading = false }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading passenger history...</Typography>
      </Box>
    );
  }

  if (!passenger && !history.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No passenger history available</Typography>
      </Box>
    );
  }

  const getFlightStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'delayed':
        return 'warning';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.flightDate) - new Date(a.flightDate)
  );

  return (
    <Box>
      {/* Passenger Summary */}
      {passenger && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
              <FlightIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h1">
                {formatPassengerName(passenger.passengerName)}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Travel History
              </Typography>
            </Box>
          </Box>

          {/* Summary Stats */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">
                  {formatNumber(passenger.totalFlights)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Flights
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {formatCurrency(passenger.totalSpent, passenger.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Spent
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">
                  {formatNumber(passenger.frequentFlyerMiles)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  FF Miles
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">
                  {passenger.countriesVisited || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Countries Visited
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Flight History Timeline */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Flight History
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {sortedHistory.length > 0 ? (
          <Timeline>
            {sortedHistory.map((flight, index) => (
              <TimelineItem key={flight.id || index}>
                <TimelineSeparator>
                  <TimelineDot color={getFlightStatusColor(flight.status)}>
                    <FlightIcon />
                  </TimelineDot>
                  {index < sortedHistory.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                
                <TimelineContent>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      {/* Flight Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="h6">
                            {flight.flightNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatTicketNumber(flight.ticketNumber)}
                          </Typography>
                        </Box>
                        <Chip
                          label={flight.status || 'Completed'}
                          color={getFlightStatusColor(flight.status)}
                          size="small"
                        />
                      </Box>

                      {/* Route Information */}
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AirportIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {flight.origin} → {flight.destination}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {formatDate(flight.flightDate)}
                              {flight.departureTime && ` at ${formatTime(flight.departureTime)}`}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Flight Details */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            Class
                          </Typography>
                          <Typography variant="body2">
                            {flight.class || 'Economy'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            Fare
                          </Typography>
                          <Typography variant="body2">
                            {formatCurrency(flight.fare, flight.currency)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            Miles Earned
                          </Typography>
                          <Typography variant="body2">
                            {formatNumber(flight.milesEarned || 0)}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Additional Details */}
                      {(flight.seat || flight.meal || flight.baggage) && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                          <List dense>
                            {flight.seat && (
                              <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                  primary="Seat"
                                  secondary={flight.seat}
                                />
                              </ListItem>
                            )}
                            {flight.meal && (
                              <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                  primary="Meal"
                                  secondary={flight.meal}
                                />
                              </ListItem>
                            )}
                            {flight.baggage && (
                              <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                  primary="Baggage"
                                  secondary={flight.baggage}
                                />
                              </ListItem>
                            )}
                          </List>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No flight history available
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PassengerHistory;