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
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ConfirmationNumber as TicketIcon,
  Person as PersonIcon,
  Flight as FlightIcon,
  Business as BusinessIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchTicketDetails } from '../store/slices/transactionSlice';
import { addNotification } from '../store/slices/uiSlice';

// Utils
import { formatCurrency, formatDate, formatTime, formatPassengerName, formatTicketNumber } from '../utils/formatters';

const TicketDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { ticketNumber } = useParams();

  const { ticketDetails } = useAppSelector((state) => state.transactions);
  const { loading, data: ticket, error } = ticketDetails;

  // Load ticket details on component mount
  React.useEffect(() => {
    if (ticketNumber) {
      dispatch(fetchTicketDetails(ticketNumber));
    }
  }, [dispatch, ticketNumber]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewTransaction = () => {
    if (ticket?.TRNN) {
      navigate(`/transactions/${ticket.TRNN}`);
    }
  };

  const handleViewPassenger = () => {
    if (ticket?.passenger) {
      navigate(`/passengers/${ticket.TRNN}`);
    }
  };

  const handlePrint = () => {
    window.print();
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
          Back
        </Button>
        <Alert severity="error">
          Error loading ticket details: {error}
        </Alert>
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="warning">
          Ticket not found
        </Alert>
      </Box>
    );
  }

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
              Ticket Details
            </Typography>
            <Typography variant="h6" color="text.secondary" fontFamily="monospace">
              {formatTicketNumber(ticketNumber)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Print Ticket">
            <IconButton onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="QR Code">
            <IconButton>
              <QrCodeIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Ticket Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Ticket Information
                </Typography>
                <Chip
                  label={ticket.status || 'Active'}
                  color={ticket.status === 'Used' ? 'success' : 'primary'}
                  variant="outlined"
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ticket Number
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      {formatTicketNumber(ticket.TDNR)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Issue Date
                    </Typography>
                    <Typography variant="h6">
                      {formatDate(ticket.DAIS)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Transaction Number
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      TXN-{ticket.TRNN}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Issuing Agent
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      {ticket.AGTN}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          {ticket.passenger && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Passenger Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="body2" color="text.secondary">
                      Passenger Name
                    </Typography>
                    <Typography variant="h5" fontWeight={500}>
                      {formatPassengerName(ticket.passenger.PXNM)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Passenger Type
                    </Typography>
                    <Chip
                      label={ticket.passenger.PXTP || 'ADT'}
                      color={ticket.passenger.PXTP === 'CHD' ? 'warning' : 'default'}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Flight Itinerary */}
          {ticket.itinerary && ticket.itinerary.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Flight Itinerary
                </Typography>

                {ticket.itinerary.map((segment, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2, bgcolor: 'grey.50' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Segment {index + 1}
                        </Typography>
                        <Chip 
                          label={segment.FLTN || 'Flight'} 
                          size="small" 
                          color="primary"
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                            <Typography variant="h4" fontWeight="bold" color="primary">
                              {segment.ORAC}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Departure
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(segment.DEDT)} {formatTime(segment.DETM)}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                            <Typography variant="h4" fontWeight="bold" color="secondary">
                              {segment.DSTC}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Arrival
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(segment.ARDT)} {formatTime(segment.ARTM)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {segment.CLSS && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Class of Service: <strong>{segment.CLSS}</strong>
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>

              <List>
                <ListItem button onClick={handleViewTransaction} sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <TicketIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="View Transaction"
                    secondary={`TXN-${ticket.TRNN}`}
                  />
                </ListItem>

                {ticket.passenger && (
                  <ListItem button onClick={handleViewPassenger} sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Passenger Details"
                      secondary={formatPassengerName(ticket.passenger.PXNM)}
                    />
                  </ListItem>
                )}

                <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <BusinessIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Issuing Office"
                    secondary={ticket.AGTN}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Ticket Status */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Ticket Status
              </Typography>

              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  ✓
                </Typography>
                <Typography variant="h6" color="success.main">
                  Valid Ticket
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This ticket is valid for travel
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {formatCurrency(ticket.financial?.TDAM || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Details */}
        {ticket.financial && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Financial Breakdown
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Currency</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Base Fare</TableCell>
                        <TableCell align="right">{formatCurrency(ticket.financial.BFAM)}</TableCell>
                        <TableCell>{ticket.financial.CUTP || 'USD'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Taxes & Fees</TableCell>
                        <TableCell align="right">{formatCurrency(ticket.financial.TXAM)}</TableCell>
                        <TableCell>{ticket.financial.CUTP || 'USD'}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
                        <TableCell>Total Amount</TableCell>
                        <TableCell align="right">{formatCurrency(ticket.financial.TDAM)}</TableCell>
                        <TableCell>{ticket.financial.CUTP || 'USD'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TicketDetails;