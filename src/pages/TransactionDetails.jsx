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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Person as PersonIcon,
  Flight as FlightIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchTransactionDetails } from '../store/slices/transactionSlice';
import { addNotification } from '../store/slices/uiSlice';

// Utils
import {
  formatCurrency,
  formatDate,
  formatPassengerName,
  formatAgentCode,
  formatTicketNumber,
} from '../utils/formatters';

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

  // Parse COBOL amount format: "0000001000{" or "0000012551D"
  const parseAmount = (amountStr) => {
    if (!amountStr) return 0;

    // Remove special characters and convert
    const cleanStr = amountStr.replace(/[{}\s]/g, '');

    // Handle negative amounts (ending with letters like D, J, K, etc.)
    const lastChar = cleanStr.slice(-1);
    const isNegative = /[D-R}]/i.test(lastChar);

    // Remove last character if it's a letter
    const numericStr = /[A-Z]/i.test(lastChar)
      ? cleanStr.slice(0, -1)
      : cleanStr;

    const num = parseFloat(numericStr);
    const amount = isNegative ? -num : num;

    // Divide by 100 to get actual amount (stored in cents)
    return isNaN(amount) ? 0 : amount / 100;
  };

  // Get currency from CUTP field (remove trailing numbers)
  const getCurrency = (cutp) => {
    if (!cutp) return 'USD';
    return cutp.replace(/\d+$/, '');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewTicket = (ticketNumber) => {
    navigate(`/tickets/${ticketNumber}`);
  };

  const handleViewPassenger = () => {
    if (transaction?.passenger) {
      navigate(`/passengers/${transaction.sales?.TRNN}`);
    }
  };

  const handleViewOffice = () => {
    if (transaction?.sales?.AGTN) {
      navigate(`/offices/${transaction.sales.AGTN}`);
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
      dispatch(
        addNotification({
          type: 'success',
          message: 'Link copied to clipboard',
          autoHideDuration: 2000,
        })
      );
    }
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
        <Alert severity="warning">Transaction not found</Alert>
      </Box>
    );
  }

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'RFND':
      case 'EMDR':
        return 'error';
      case 'EXCH':
        return 'warning';
      case 'VOID':
        return 'secondary';
      case 'EMDS':
        return 'info';
      default:
        return 'primary';
    }
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'RFND':
        return 'Refund';
      case 'EXCH':
        return 'Exchange';
      case 'VOID':
        return 'Void';
      case 'EMDS':
        return 'EMD Sale';
      case 'EMDR':
        return 'EMD Refund';
      default:
        return 'Standard';
    }
  };

  // Extract financial data
  const totalAmount = parseAmount(transaction.financial?.TDAM);
  const netFare = parseAmount(transaction.financial?.NTFA);
  const tax1 = parseAmount(transaction.financial?.TMFA1);
  const tax2 = parseAmount(transaction.financial?.TMFA2);
  const tax3 = parseAmount(transaction.financial?.TMFA3);
  const totalTax = tax1 + tax2 + tax3;
  const currency = getCurrency(transaction.financial?.CUTP);

  // Extract commission data
  const commissionAmount = parseAmount(transaction.commission?.COAM);
  const commissionRate = transaction.commission?.CORT
    ? parseFloat(transaction.commission.CORT) / 100
    : 0;
  const effectiveCommission = parseAmount(transaction.commission?.EFCO);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Transaction Details
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              fontFamily="monospace"
            >
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
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Transaction Overview */}
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
                  Transaction Overview
                </Typography>
                <Chip
                  label={getTransactionTypeLabel(transaction.sales?.TRNC)}
                  color={getTransactionTypeColor(transaction.sales?.TRNC)}
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Transaction Number
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      {transaction.sales?.TRNN}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Issue Date
                    </Typography>
                    <Typography variant="h6">
                      {formatDate(transaction.sales?.DAIS)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ticket Number
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      {formatTicketNumber(transaction.sales?.TDNR)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Agent Code
                    </Typography>
                    <Typography variant="h6" fontFamily="monospace">
                      {formatAgentCode(transaction.sales?.AGTN)}
                    </Typography>
                  </Box>
                </Grid>

                {transaction.sales?.PNRR && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        PNR Locator
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {transaction.sales.PNRR}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {transaction.sales?.RFIC && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        RFIC Code
                      </Typography>
                      <Chip label={transaction.sales.RFIC} size="small" />
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Financial Information */}
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Financial Details
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      bgcolor: 'primary.light',
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="primary.contrastText"
                      sx={{ opacity: 0.8 }}
                    >
                      Total Amount
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary.contrastText"
                    >
                      {formatCurrency(totalAmount, currency)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      bgcolor: 'success.light',
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="success.contrastText"
                      sx={{ opacity: 0.8 }}
                    >
                      Net Fare
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="success.contrastText"
                    >
                      {formatCurrency(netFare, currency)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      bgcolor: 'warning.light',
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="warning.contrastText"
                      sx={{ opacity: 0.8 }}
                    >
                      Total Tax
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="warning.contrastText"
                    >
                      {formatCurrency(totalTax, currency)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Description</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Amount</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Net Fare (NTFA)</TableCell>
                      <TableCell align="right">
                        {formatCurrency(netFare, currency)}
                      </TableCell>
                    </TableRow>
                    {tax1 !== 0 && (
                      <TableRow>
                        <TableCell>
                          Tax 1 ({transaction.financial?.TMFT1 || 'N/A'})
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(tax1, currency)}
                        </TableCell>
                      </TableRow>
                    )}
                    {tax2 !== 0 && (
                      <TableRow>
                        <TableCell>
                          Tax 2 ({transaction.financial?.TMFT2 || 'N/A'})
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(tax2, currency)}
                        </TableCell>
                      </TableRow>
                    )}
                    {tax3 !== 0 && (
                      <TableRow>
                        <TableCell>
                          Tax 3 ({transaction.financial?.TMFT3 || 'N/A'})
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(tax3, currency)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow
                      sx={{
                        '& td': { fontWeight: 'bold', bgcolor: 'action.hover' },
                      }}
                    >
                      <TableCell>Total Document Amount (TDAM)</TableCell>
                      <TableCell align="right">
                        {formatCurrency(totalAmount, currency)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Related Information
              </Typography>

              <List>
                {transaction.passenger && (
                  <ListItem
                    button
                    onClick={handleViewPassenger}
                    sx={{ borderRadius: 1, mb: 1, bgcolor: 'action.hover' }}
                  >
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Passenger Details"
                      secondary={formatPassengerName(
                        transaction.passenger.PXNM
                      )}
                    />
                  </ListItem>
                )}

                <ListItem
                  button
                  onClick={handleViewOffice}
                  sx={{ borderRadius: 1, mb: 1, bgcolor: 'action.hover' }}
                >
                  <ListItemIcon>
                    <BusinessIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Issuing Office"
                    secondary={formatAgentCode(transaction.sales?.AGTN)}
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => handleViewTicket(transaction.sales?.TDNR)}
                  sx={{ borderRadius: 1, bgcolor: 'action.hover' }}
                >
                  <ListItemIcon>
                    <ReceiptIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ticket Details"
                    secondary={formatTicketNumber(transaction.sales?.TDNR)}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Transaction Status
              </Typography>
              <Chip
                label={getTransactionTypeLabel(transaction.sales?.TRNC)}
                color={getTransactionTypeColor(transaction.sales?.TRNC)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Currency
                </Typography>
                <Typography variant="h6">{currency}</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Commission Card */}
          {transaction.commission && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Commission Details
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Commission Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {formatCurrency(
                      commissionAmount,
                      getCurrency(transaction.commission.CUTP)
                    )}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Rate
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {commissionRate.toFixed(2)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Effective Commission
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(
                        effectiveCommission,
                        getCurrency(transaction.commission.CUTP)
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
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

                  {transaction.passenger.PXTP && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Passenger Type
                      </Typography>
                      <Chip
                        label={transaction.passenger.PXTP || 'ADT'}
                        color={
                          transaction.passenger.PXTP === 'CHD'
                            ? 'warning'
                            : transaction.passenger.PXTP === 'INF'
                            ? 'info'
                            : 'default'
                        }
                        size="small"
                      />
                    </Grid>
                  )}

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Document Number
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {transaction.passenger.TDNR}
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
                  Itinerary ({transaction.itinerary.length} segment
                  {transaction.itinerary.length > 1 ? 's' : ''})
                </Typography>

                <List sx={{ p: 0 }}>
                  {transaction.itinerary.map((segment, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 0,
                        py: 2,
                        borderBottom:
                          index < transaction.itinerary.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.light',
                          }}
                        >
                          <FlightIcon color="primary" />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="body1" fontWeight={600}>
                              {segment.ORAC} → {segment.DSTC}
                            </Typography>
                            <Chip
                              label={`${segment.CARR} ${segment.FTNR}`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={segment.FBST}
                              size="small"
                              color="success"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Segment: {segment.SEGI} • Class: {segment.RBKD} •
                              Baggage: {segment.FBAL}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Departure: {formatDate(segment.FTDA)} at{' '}
                              {segment.FTDT}
                            </Typography>
                            {segment.NADA && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                Not After: {segment.NADA}
                              </Typography>
                            )}
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

        {/* Payment Information */}
        {transaction.payment && transaction.payment.length > 0 && (
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <CreditCardIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Payment Information ({transaction.payment.length} payment
                  {transaction.payment.length > 1 ? 's' : ''})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Type</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Amount</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Card/Details</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Approval</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transaction.payment.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip
                              label={payment.FPTP}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {formatCurrency(
                              parseAmount(payment.FPAM),
                              getCurrency(payment.CUTP)
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {payment.FPAC || 'N/A'}
                            </Typography>
                            {payment.EXDA && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Exp: {payment.EXDA}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {payment.APLC || 'N/A'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {/* EMD Details */}
        {transaction.emdDetails && transaction.emdDetails.length > 0 && (
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <TagIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  EMD Details ({transaction.emdDetails.length} EMD
                  {transaction.emdDetails.length > 1 ? 's' : ''})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {transaction.emdDetails.map((emd, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            EMD #{emd.EMCP}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Value
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(
                                  parseAmount(emd.EMCV),
                                  getCurrency(emd.CUTP)
                                )}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Related Ticket
                              </Typography>
                              <Typography
                                variant="body2"
                                fontFamily="monospace"
                              >
                                {formatTicketNumber(emd.EMRT)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Service Code
                              </Typography>
                              <Typography variant="body2">
                                {emd.EMSC}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Operating Carrier
                              </Typography>
                              <Typography variant="body2">
                                {emd.EMOC}
                              </Typography>
                            </Grid>
                            {transaction.emdRemarks &&
                              transaction.emdRemarks[index] && (
                                <Grid item xs={12}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Remark
                                  </Typography>
                                  <Typography variant="body2">
                                    {transaction.emdRemarks[index].EMRM}
                                  </Typography>
                                </Grid>
                              )}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {/* Fare Calculation */}
        {transaction.fareCalculation && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Fare Calculation
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {transaction.fareCalculation.FRCA}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TransactionDetails;
