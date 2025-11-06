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

// Utils
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatPassengerName,
  formatTicketNumber,
} from '../utils/formatters';

const TicketDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { ticketNumber } = useParams();

  const { ticketDetails } = useAppSelector((state) => state.transactions);
  const { loading, data, error } = ticketDetails;

  // Fetch ticket details
  React.useEffect(() => {
    if (ticketNumber) {
      dispatch(fetchTicketDetails(ticketNumber));
    }
  }, [dispatch, ticketNumber]);

  const handleBack = () => navigate(-1);
  const handleViewTransaction = () =>
    data?.sales?.TRNN && navigate(`/transactions/${data.sales.TRNN}`);
  const handleViewPassenger = () =>
    data?.passenger && navigate(`/passengers/${data.sales.TRNN}`);
  const handlePrint = () => window.print();

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
        <Alert severity="error">Error loading ticket details: {error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="warning">Ticket not found</Alert>
      </Box>
    );
  }

  const ticket = data.sales || {};
  const passenger = data.passenger || {};
  const itinerary = data.itinerary || [];
  const payment = data.payment || [];
  const financial = data.financial || {};
  const office = data.officeInfo || {};

  // Extract numeric value safely
  const parseAmount = (val) => {
    if (!val) return 0;
    const match = String(val).match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

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
              Ticket Details
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              fontFamily="monospace"
            >
              {formatTicketNumber(data.ticketNumber)}
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Ticket Information
                </Typography>
                <Chip label="Active" color="primary" variant="outlined" />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ticket Number
                  </Typography>
                  <Typography variant="h6" fontFamily="monospace">
                    {formatTicketNumber(ticket.TDNR)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Issue Date
                  </Typography>
                  <Typography variant="h6">{ticket.DAIS}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction Number
                  </Typography>
                  <Typography variant="h6" fontFamily="monospace">
                    TXN-{ticket.TRNN}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Issuing Agent
                  </Typography>
                  <Typography variant="h6" fontFamily="monospace">
                    {ticket.AGTN || office.AGTN}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Passenger Info */}
          {passenger && passenger.PXNM && (
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
                      {formatPassengerName(passenger.PXNM)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Passenger Type
                    </Typography>
                    <Chip label={passenger.PXTP || 'ADT'} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Flight Itinerary */}
          {Array.isArray(itinerary) && itinerary.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Flight Itinerary
                </Typography>

                {itinerary.map((seg, i) => (
                  <Card
                    key={i}
                    variant="outlined"
                    sx={{ mb: 2, bgcolor: 'grey.50' }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          Segment {seg.SEGI}
                        </Typography>
                        <Chip
                          label={`${seg.CARR}${seg.FTNR}`}
                          size="small"
                          color="primary"
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 2,
                              bgcolor: 'white',
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              color="primary"
                            >
                              {seg.ORAC}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Departure
                            </Typography>
                            <Typography variant="body2">
                              {seg.FTDA} {seg.FTDT}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 2,
                              bgcolor: 'white',
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              color="secondary"
                            >
                              {seg.DSTC}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Arrival
                            </Typography>
                            <Typography variant="body2">{seg.NADA}</Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Class of Service: <strong>{seg.RBKD}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: <strong>{seg.FBST}</strong>
                        </Typography>
                      </Box>
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
                <ListItem
                  button
                  onClick={handleViewTransaction}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemIcon>
                    <TicketIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="View Transaction"
                    secondary={`TXN-${ticket.TRNN}`}
                  />
                </ListItem>

                {passenger?.PXNM && (
                  <ListItem
                    button
                    onClick={handleViewPassenger}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Passenger Details"
                      secondary={formatPassengerName(passenger.PXNM)}
                    />
                  </ListItem>
                )}

                <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <BusinessIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Issuing Office"
                    secondary={office.AGTN || ticket.AGTN}
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

              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {formatCurrency(parseAmount(financial.TDAM))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Breakdown */}
        {financial && (
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
                      {financial.TMFT1 && (
                        <TableRow>
                          <TableCell>{financial.TMFT1}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(parseAmount(financial.TMFA1))}
                          </TableCell>
                          <TableCell>{financial.CUTP || 'USD'}</TableCell>
                        </TableRow>
                      )}
                      {financial.TMFT2 && (
                        <TableRow>
                          <TableCell>{financial.TMFT2}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(parseAmount(financial.TMFA2))}
                          </TableCell>
                          <TableCell>{financial.CUTP || 'USD'}</TableCell>
                        </TableRow>
                      )}
                      {financial.TMFT3 && (
                        <TableRow>
                          <TableCell>{financial.TMFT3}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(parseAmount(financial.TMFA3))}
                          </TableCell>
                          <TableCell>{financial.CUTP || 'USD'}</TableCell>
                        </TableRow>
                      )}
                      <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
                        <TableCell>Total Amount</TableCell>
                        <TableCell align="right">
                          {formatCurrency(parseAmount(financial.TDAM))}
                        </TableCell>
                        <TableCell>{financial.CUTP || 'USD'}</TableCell>
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
