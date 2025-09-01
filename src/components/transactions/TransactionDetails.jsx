// src/components/transactions/TransactionDetails.jsx
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
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Flight as FlightIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
  LocalAirport as AirportIcon,
} from '@mui/icons-material';

// Utils
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatTicketNumber,
  formatAgentCode,
  formatPassengerName,
} from '../../utils/formatters';

const TransactionDetails = ({ transaction, loading = false }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading transaction details...</Typography>
      </Box>
    );
  }

  if (!transaction) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No transaction data available</Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'refunded':
        return 'error';
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
            <ReceiptIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              {formatTicketNumber(transaction.ticketNumber)}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Transaction #{transaction.transactionNumber}
            </Typography>
          </Box>
          <Chip
            label={transaction.status || 'Unknown'}
            color={getStatusColor(transaction.status)}
            size="large"
          />
        </Box>

        <Typography variant="h6" color="primary.main">
          {formatCurrency(transaction.totalAmount, transaction.currency)}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Transaction Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Transaction Date"
                  secondary={formatDate(transaction.transactionDate)}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Agent Code"
                  secondary={formatAgentCode(transaction.agentCode)}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Transaction Type"
                  secondary={transaction.type || 'N/A'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <MoneyIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Currency"
                  secondary={transaction.currency || 'USD'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Passenger Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Passenger Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Passenger Name"
                  secondary={formatPassengerName(transaction.passengerName)}
                />
              </ListItem>

              {transaction.passengerType && (
                <ListItem>
                  <ListItemText
                    primary="Passenger Type"
                    secondary={transaction.passengerType}
                  />
                </ListItem>
              )}

              {transaction.frequentFlyerNumber && (
                <ListItem>
                  <ListItemText
                    primary="Frequent Flyer Number"
                    secondary={transaction.frequentFlyerNumber}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Flight Information */}
        {transaction.flights && transaction.flights.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Flight Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {transaction.flights.map((flight, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FlightIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      {flight.flightNumber}
                    </Typography>
                    <Chip
                      label={flight.class || 'Economy'}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AirportIcon fontSize="small" />
                        <Typography variant="body2">
                          {flight.origin} → {flight.destination}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(flight.departureDate)} at {formatTime(flight.departureTime)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {index < transaction.flights.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}
            </Paper>
          </Grid>
        )}

        {/* Financial Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Breakdown
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Base Fare"
                  secondary={formatCurrency(transaction.baseFare, transaction.currency)}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Taxes & Fees"
                  secondary={formatCurrency(transaction.taxes, transaction.currency)}
                />
              </ListItem>

              {transaction.commission && (
                <ListItem>
                  <ListItemText
                    primary="Commission"
                    secondary={formatCurrency(transaction.commission, transaction.currency)}
                  />
                </ListItem>
              )}

              <Divider sx={{ my: 1 }} />

              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total Amount
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h6" color="primary.main">
                      {formatCurrency(transaction.totalAmount, transaction.currency)}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Payment Information */}
        {transaction.paymentMethod && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CreditCardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Payment Method"
                    secondary={transaction.paymentMethod}
                  />
                </ListItem>

                {transaction.cardType && (
                  <ListItem>
                    <ListItemText
                      primary="Card Type"
                      secondary={transaction.cardType}
                    />
                  </ListItem>
                )}

                {transaction.authorizationCode && (
                  <ListItem>
                    <ListItemText
                      primary="Authorization Code"
                      secondary={transaction.authorizationCode}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TransactionDetails;