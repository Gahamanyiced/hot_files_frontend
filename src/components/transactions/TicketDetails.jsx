// src/components/transactions/TicketDetails.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon,
  Flight as FlightIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Airline as AirlineIcon,
} from '@mui/icons-material';

// Utils
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatTicketNumber,
  formatPassengerName,
} from '../../utils/formatters';

const TicketDetails = ({ ticket, loading = false }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading ticket details...</Typography>
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No ticket data available</Typography>
      </Box>
    );
  }

  const getTicketStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'issued':
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'refunded':
        return 'error';
      case 'used':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
            <TicketIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              {formatTicketNumber(ticket.ticketNumber)}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              E-Ticket
            </Typography>
          </Box>
          <Chip
            label={ticket.status || 'Unknown'}
            color={getTicketStatusColor(ticket.status)}
            size="large"
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Passenger Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Passenger Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Name"
                  secondary={formatPassengerName(ticket.passengerName)}
                />
              </ListItem>

              {ticket.passengerTitle && (
                <ListItem>
                  <ListItemText
                    primary="Title"
                    secondary={ticket.passengerTitle}
                  />
                </ListItem>
              )}

              {ticket.dateOfBirth && (
                <ListItem>
                  <ListItemText
                    primary="Date of Birth"
                    secondary={formatDate(ticket.dateOfBirth)}
                  />
                </ListItem>
              )}

              {ticket.frequentFlyerNumber && (
                <ListItem>
                  <ListItemText
                    primary="Frequent Flyer Number"
                    secondary={ticket.frequentFlyerNumber}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Ticket Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ticket Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Issue Date"
                  secondary={formatDate(ticket.issueDate)}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Validating Carrier"
                  secondary={ticket.validatingCarrier || 'N/A'}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Ticket Type"
                  secondary={ticket.ticketType || 'Electronic'}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Total Amount"
                  secondary={formatCurrency(ticket.totalAmount, ticket.currency)}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Flight Segments */}
        {ticket.segments && ticket.segments.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Flight Itinerary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Flight</TableCell>
                      <TableCell>Route</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Departure</TableCell>
                      <TableCell>Arrival</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ticket.segments.map((segment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FlightIcon fontSize="small" />
                            {segment.flightNumber}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {segment.origin} → {segment.destination}
                        </TableCell>
                        <TableCell>
                          {formatDate(segment.departureDate)}
                        </TableCell>
                        <TableCell>
                          {formatTime(segment.departureTime)}
                        </TableCell>
                        <TableCell>
                          {formatTime(segment.arrivalTime)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={segment.class || 'Y'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={segment.status || 'Confirmed'}
                            size="small"
                            color={getTicketStatusColor(segment.status)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}

        {/* Fare Breakdown */}
        {ticket.fareBreakdown && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fare Breakdown
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                {Object.entries(ticket.fareBreakdown).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText
                      primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      secondary={formatCurrency(value, ticket.currency)}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Additional Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              {ticket.restrictions && (
                <ListItem>
                  <ListItemText
                    primary="Restrictions"
                    secondary={ticket.restrictions}
                  />
                </ListItem>
              )}

              {ticket.baggage && (
                <ListItem>
                  <ListItemText
                    primary="Baggage Allowance"
                    secondary={ticket.baggage}
                  />
                </ListItem>
              )}

              {ticket.seat && (
                <ListItem>
                  <ListItemText
                    primary="Seat Assignment"
                    secondary={ticket.seat}
                  />
                </ListItem>
              )}

              {ticket.meal && (
                <ListItem>
                  <ListItemText
                    primary="Meal Preference"
                    secondary={ticket.meal}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketDetails;