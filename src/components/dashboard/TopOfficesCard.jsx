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
  LinearProgress,
  IconButton,
  Tooltip,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatAgentCode,
} from '../../utils/formatters';

const TopOfficesCard = ({
  data = [],
  loading = false,
  title = 'Top Performing Offices',
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleViewOffice = (agentCode) => {
    navigate(`/offices/${agentCode}`);
  };

  const getPerformanceColor = (rank) => {
    switch (rank) {
      case 1:
        return theme.palette.warning.main; // Gold
      case 2:
        return theme.palette.grey[400]; // Silver
      case 3:
        return theme.palette.warning.dark; // Bronze
      default:
        return theme.palette.primary.main;
    }
  };

  const getMaxRevenue = () => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map((office) => office.totalRevenue || 0));
  };

  const maxRevenue = getMaxRevenue();

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
            >
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
              <Skeleton variant="text" width="20%" />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

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
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <TrendingUpIcon color="primary" />
        </Box>

        {!data || data.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <BusinessIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              No office data available
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {data.slice(0, 5).map((office, index) => {
              const rank = index + 1;
              const revenuePercentage =
                maxRevenue > 0 ? (office.totalRevenue / maxRevenue) * 100 : 0;

              return (
                <ListItem
                  key={office.agentCode || index}
                  sx={{
                    px: 0,
                    py: 1,
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
                        bgcolor: getPerformanceColor(rank),
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {rank <= 3 ? <StarIcon fontSize="small" /> : rank}
                    </Avatar>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {formatAgentCode(office.agentCode)}
                        </Typography>
                        {rank === 1 && (
                          <Chip
                            label="Top"
                            size="small"
                            color="warning"
                            sx={{ height: 20, fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {office.location || 'Unknown Location'}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="success.main"
                            fontWeight={500}
                          >
                            {formatCurrency(office.totalRevenue || 0)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            • {formatNumber(office.transactionCount || 0)} txns
                          </Typography>
                        </Box>

                        {/* Performance Bar */}
                        <LinearProgress
                          variant="determinate"
                          value={revenuePercentage}
                          sx={{
                            mt: 0.5,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getPerformanceColor(rank),
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                    }
                  />

                  <ListItemSecondaryAction>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        #{rank}
                      </Typography>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOffice(office.agentCode)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}

        {data && data.length > 5 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              +{data.length - 5} more offices
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TopOfficesCard;
