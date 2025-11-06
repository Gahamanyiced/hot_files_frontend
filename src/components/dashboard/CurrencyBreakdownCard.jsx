// src/components/dashboard/CurrencyBreakdownCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  useTheme,
  Skeleton,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  SwapHoriz as ConvertIcon,
} from '@mui/icons-material';

// Utils
import { formatCurrency, formatExchangeRate, formatNumber } from '../../utils/formatters';

const CurrencyBreakdownCard = ({
  breakdown = [],
  targetCurrency = 'USD',
  loading = false,
  title = 'Currency Breakdown',
  type = 'revenue', // 'revenue' | 'commission'
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!breakdown || breakdown.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No currency data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getTotalConverted = () => {
    return breakdown.reduce((sum, item) => {
      return sum + (item.converted?.totalAmount || 0);
    }, 0);
  };

  const getCurrencyColor = (currency) => {
    const colors = {
      USD: theme.palette.primary.main,
      EUR: theme.palette.secondary.main,
      XAF: theme.palette.success.main,
      GBP: theme.palette.warning.main,
      CAD: theme.palette.info.main,
    };
    return colors[currency] || theme.palette.grey[500];
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <Chip
              label={`${breakdown.length} currencies`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <IconButton
            onClick={handleExpandClick}
            size="small"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
              }),
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Currency</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Original Amount</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Rate</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Converted ({targetCurrency})</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Transactions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {breakdown.map((item) => {
                  const isTargetCurrency = item.currency === targetCurrency;

                  return (
                    <TableRow
                      key={item.currency}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: isTargetCurrency
                          ? theme.palette.action.hover
                          : 'inherit',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: getCurrencyColor(item.currency),
                            }}
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {item.currency}
                          </Typography>
                          {isTargetCurrency && (
                            <Chip label="Base" size="small" color="primary" />
                          )}
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(
                            item.original?.totalAmount || 0,
                            item.currency
                          )}
                        </Typography>
                        {type === 'revenue' && item.original?.totalFare && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Fare: {formatCurrency(item.original.totalFare, item.currency)}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                          }}
                        >
                          {!isTargetCurrency && <ConvertIcon fontSize="small" />}
                          <Typography variant="body2" fontFamily="monospace">
                            {formatExchangeRate(item.exchangeRate)}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {formatCurrency(
                            item.converted?.totalAmount || 0,
                            targetCurrency
                          )}
                        </Typography>
                        {type === 'revenue' && item.converted?.totalFare && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Fare: {formatCurrency(item.converted.totalFare, targetCurrency)}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatNumber(item.original?.transactionCount || 0)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* Totals Row */}
                <TableRow
                  sx={{
                    backgroundColor: theme.palette.action.selected,
                    fontWeight: 'bold',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      TOTAL
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700}>
                      -
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={700}>
                      -
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="primary.main"
                    >
                      {formatCurrency(getTotalConverted(), targetCurrency)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700}>
                      {formatNumber(
                        breakdown.reduce(
                          (sum, item) =>
                            sum + (item.original?.transactionCount || 0),
                          0
                        )
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Box */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1,
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Grand Total in {targetCurrency}:
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {formatCurrency(getTotalConverted(), targetCurrency)}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Converted from {breakdown.length} different{' '}
              {breakdown.length === 1 ? 'currency' : 'currencies'}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default CurrencyBreakdownCard;