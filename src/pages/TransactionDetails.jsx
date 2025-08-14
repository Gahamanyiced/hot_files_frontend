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
  Person as PersonIcon,
  Flight as FlightIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  DateRange as DateIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchTransactionDetails } from '../store/slices/transactionSlice';
import { addNotification } from '../store/slices/uiSlice';

// Utils
import { formatCurrency, formatDate, formatTime, formatPassengerName, formatAgentCode, formatTicketNumber } from '../utils/formatters';

const TransactionDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { transactionNumber } = useParams();

  const { transactionDetails } = useAppSelector((state) => state.transactions);
  const { loading, data: transaction, error } = transactionDetails;

  // Load transaction details on component mount
  React.useEffect(() => {
    if (transactionNumber) {
      dispatch(fetchTransactionDetails(transactionNumber));
    }
  }, [dispatch, transactionNumber]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewTicket = (ticketNumber) => {
    navigate(`/tickets/${ticketNumber}`);
  };

  const handleViewPassenger = () => {
    if (transaction?.passenger) {
      navigate(`/passengers/${transaction.TRNN}`);
    }
  };

  const handleViewOffice = () => {
    if (transaction?.AGTN) {
      navigate(`/offices/${transaction.AGTN}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Transaction ${transactionNumber}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      dispatch(addNotification({
        type: 'success',
        message: 'Link copied to clipboard',
        autoHideDuration: 2000,
      }));
    }
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
          Back to Transactions
        </Button>
        <Alert severity="error">
          Error loading transaction details: {error}
        </Alert>
      </Box>
    );
  }

  if (!transaction) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Transactions
        </Button>
        <Alert severity="warning">
          Transaction not found
        </Alert>
      </Box>
    );
  }

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'RFND': return 'error';
      case 'EXCH': return 'warning';
      case 'VOID': return 'secondary';
      default: return 'primary';
    }
  };

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
              Transaction Details
            </Typography>
            <Typography variant="h6" color="text.secondary">
              TXN-{transactionNumber}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Print">
            <IconButton onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" startIcon={<EditIcon />}>
            Edit
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Transaction Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Transaction Overview
                </Typography>
                <Chip
                  label={transaction.TRNC || 'STD'}
                  color={getTransactionTypeColor(transaction.TRNC)}
                  variant="outlined"
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Transaction Number
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      TXN-{transaction.TRNN}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Issue Date
                    </Typography>
                    <Typography variant="h6">
                      {formatDate(transaction.DAIS)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ticket Number
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      {formatTicketNumber(transaction.TDNR)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Agent Code
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      {formatAgentCode(transaction.AGTN)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Financial Information */}
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Financial Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="success.dark">
                      {formatCurrency(transaction.financial?.TDAM)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Base Fare
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="info.dark">
                      {formatCurrency(transaction.financial?.BFAM)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tax Amount
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="warning.dark">
                      {formatCurrency(transaction.financial?.TXAM)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {transaction.financial && (
                <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
                  <Table size="small">
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
                        <TableCell align="right">{formatCurrency(transaction.financial.BFAM)}</TableCell>
                        <TableCell>{transaction.financial.CUTP || 'USD'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax Amount</TableCell>
                        <TableCell align="right">{formatCurrency(transaction.financial.TXAM)}</TableCell>
                        <TableCell>{transaction.financial.CUTP || 'USD'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Commission</TableCell>
                        <TableCell align="right">{formatCurrency(transaction.financial.COAM)}</TableCell>
                        <TableCell>{transaction.financial.CUTP || 'USD'}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
                        <TableCell>Total Amount</TableCell>
                        <TableCell align="right">{formatCurrency(transaction.financial.TDAM)}</TableCell>
                        <TableCell>{transaction.financial.CUTP || 'USD'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Related Information
              </Typography>

              <List>
                {transaction.passenger && (
                  <ListItem button onClick={handleViewPassenger} sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Passenger Details"
                      secondary={formatPassengerName(transaction.passenger.PXNM)}
                    />
                  </ListItem>
                )}

                <ListItem button onClick={handleViewOffice} sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <BusinessIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Issuing Office"
                    secondary={formatAgentCode(transaction.AGTN)}
                  />
                </ListItem>

                <ListItem button onClick={() => handleViewTicket(transaction.TDNR)} sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <ReceiptIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ticket Details"
                    secondary={formatTicketNumber(transaction.TDNR)}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Transaction Status
              </Typography>
              <Chip
                label={transaction.TRNC === 'RFND' ? 'Refunded' : transaction.TRNC === 'VOID' ? 'Voided' : 'Active'}
                color={getTransactionTypeColor(transaction.TRNC)}
                sx={{ mb: 2 }}
              />

              {transaction.RMED && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last Modified
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(transaction.RMED)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Passenger Information */}
        {transaction.passenger && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Passenger Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Passenger Name
                    </Typography>
                    <Typography variant="h6">
                      {formatPassengerName(transaction.passenger.PXNM)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Passenger Type
                    </Typography>
                    <Chip
                      label={transaction.passenger.PXTP || 'ADT'}
                      color={transaction.passenger.PXTP === 'CHD' ? 'warning' : 'default'}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Transaction Number
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {transaction.passenger.TRNN}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Itinerary Information */}
        {transaction.itinerary && transaction.itinerary.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Itinerary
                </Typography>

                <List sx={{ p: 0 }}>
                  {transaction.itinerary.map((segment, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <FlightIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                              {segment.ORAC} → {segment.DSTC}
                            </Typography>
                            <Chip label={segment.FLTN || 'Flight'} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Departure: {formatDate(segment.DEDT)} {formatTime(segment.DETM)}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              Arrival: {formatDate(segment.ARDT)} {formatTime(segment.ARTM)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Additional Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Additional Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Form of Payment
                  </Typography>
                  <Typography variant="body2">
                    {transaction.financial?.FOPD || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Commission Rate
                  </Typography>
                  <Typography variant="body2">
                    {transaction.financial?.CORT ? `${transaction.financial.CORT}%` : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Tour Code
                  </Typography>
                  <Typography variant="body2">
                    {transaction.TOCD || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    PNR
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {transaction.RLOC || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              {transaction.remarks && transaction.remarks.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Remarks
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    {transaction.remarks.map((remark, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                        • {remark}
                      </Typography>
                    ))}
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionDetails;