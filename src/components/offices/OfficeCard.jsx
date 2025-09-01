// src/components/offices/OfficeCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatAgentCode,
  formatPercentage,
} from '../../utils/formatters';

const OfficeCard = ({
  office,
  onView,
  onSelect,
  selected = false,
  showActions = true,
  compact = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleView = () => {
    if (onView) {
      onView(office);
    } else {
      navigate(`/offices/${office.agentCode}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'suspended':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUpIcon color="success" fontSize="small" />;
    if (trend < 0) return <TrendingDownIcon color="error" fontSize="small" />;
    return null;
  };

  const getPerformanceLevel = (performance) => {
    if (performance >= 90) return { color: 'success', label: 'Excellent' };
    if (performance >= 75) return { color: 'info', label: 'Good' };
    if (performance >= 60) return { color: 'warning', label: 'Average' };
    return { color: 'error', label: 'Poor' };
  };

  const performanceData = office.performanceScore ? getPerformanceLevel(office.performanceScore) : null;

  return (
    <Card
      sx={{
        border: selected ? 2 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onSelect ? () => onSelect(office) : undefined}
    >
      <CardContent sx={{ flexGrow: 1, pb: compact ? 1 : 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <BusinessIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {formatAgentCode(office.agentCode)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {office.officeName || 'Office Name N/A'}
            </Typography>
          </Box>
          <Chip
            label={office.status || 'Active'}
            color={getStatusColor(office.status)}
            size="small"
          />
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 0.5 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {office.city && office.country 
              ? `${office.city}, ${office.country}` 
              : office.country || 'Location N/A'}
          </Typography>
        </Box>

        {!compact && (
          <>
            {/* Revenue */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="h6" color="primary.main">
                    {formatCurrency(office.totalRevenue, office.currency)}
                  </Typography>
                  {getTrendIcon(office.revenueTrend)}
                </Box>
              </Box>
              {office.revenueTrend !== undefined && (
                <Typography variant="caption" color="text.secondary">
                  {office.revenueTrend > 0 ? '+' : ''}{formatPercentage(office.revenueTrend)} vs last period
                </Typography>
              )}
            </Box>

            {/* Key Metrics */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {formatNumber(office.transactionCount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Transactions
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {formatCurrency(office.avgTicketValue, office.currency)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg Ticket
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {formatNumber(office.agentCount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Agents
                </Typography>
              </Box>
            </Box>

            {/* Performance Score */}
            {office.performanceScore !== undefined && performanceData && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Performance
                  </Typography>
                  <Chip
                    label={performanceData.label}
                    color={performanceData.color}
                    size="small"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={office.performanceScore}
                  color={performanceData.color}
                  sx={{ height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {office.performanceScore}%
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Currency */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <MoneyIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Currency: {office.currency || 'USD'}
          </Typography>
        </Box>
      </CardContent>

      {showActions && (
        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={handleView}
            fullWidth
          >
            View Details
          </Button>
          
          <Tooltip title="View Analytics">
            <IconButton
              size="small"
              onClick={() => navigate(`/analytics?office=${office.agentCode}`)}
            >
              <AssessmentIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="View Agents">
            <IconButton
              size="small"
              onClick={() => navigate(`/agents?office=${office.agentCode}`)}
            >
              <PeopleIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};

export default OfficeCard;