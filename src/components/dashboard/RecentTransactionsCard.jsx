import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Button,
  useTheme,
} from '@mui/material';
import {
  Receipt as TransactionIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  MoreHoriz as MoreIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { fetchTransactions } from '../../store/slices/transactionSlice';

// Utils
import { formatCurrency, formatDate, formatPassengerName, formatTimeAgo } from '../../utils/formatters';

const RecentTransactionsCard = ({ loading = false, title = "Recent Transactions" }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { transactions } = useAppSelector((state) => state.transactions);
  const { data: transactionData, loading: transactionLoading } = transactions;

  // Load recent transactions on mount
  React.useEffect(() => {
    dispatch(fetchTransactions({
      page: 1,
      limit: 10,
      sortBy: 'DAIS',
      sortOrder: 'desc',
    }));
  }, [dispatch]);

  const handleViewTransaction = (transactionNumber) => {
    navigate(`/transactions/${transactionNumber}`);
  };

  const handleViewAll = () => {
    navigate('/transactions');
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'RFND':
        return 'error';
      case 'EXCH':
        return 'warning';
      case 'VOID':
        return 'secondary';
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
      case 'EMD':
        return 'EMD';
      default:
        return 'Standard';
    }
  };

  const isLoading = loading || transactionLoading;
  const recentTransactions = transactionData?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="50%" />
              </Box>
              <Skeleton variant="text" width="15%" />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <TrendingIcon color="primary" />
        </Box>

        {recentTransactions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <TransactionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No recent transactions
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ p: 0 }}>
              {recentTransactions.map((transaction, index) => (
                <ListItem
                  key={transaction.TRNN || index}
                  sx={{
                    px: 0,
                    py: 1.5,
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.secondary.main,
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={500} noWrap>
                          TXN-{transaction.TRNN}
                        </Typography>
                        {transaction.TRNC && (
                          <Chip
                            label={getTransactionTypeLabel(transaction.TRNC)}
                            size="small"
                            color={getTransactionTypeColor(transaction.TRNC)}
                            sx={{ height: 20, fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.primary" fontWeight={500}>
                          {formatPassengerName(transaction.passenger?.PXNM || 'Unknown Passenger')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" color="success.main" fontWeight={500}>
                            {formatCurrency(transaction.financial?.TDAM || 0)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            • Agent: {transaction.AGTN}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(transaction.DAIS)}
                        </Typography>
                      </Box>
                    }
                  />

                  <ListItemSecondaryAction>
                    <Tooltip title="View Transaction">
                      <IconButton
                        size="small"
                        onClick={() => handleViewTransaction(transaction.TRNN)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            {/* View All Button */}
            <Box sx={{ textAlign: 'center', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="text"
                size="small"
                onClick={handleViewAll}
                endIcon={<MoreIcon />}
              >
                View All Transactions
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;