// src/components/passengers/PassengerCard.jsx
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
  Person as PersonIcon,
  Flight as FlightIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatPassengerName,
} from '../../utils/formatters';

const PassengerCard = ({
  passenger,
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
      onView(passenger);
    } else {
      navigate(`/passengers/${passenger.transactionNumber}`);
    }
  };

  const getPassengerTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'frequent':
      case 'vip':
        return 'primary';
      case 'business':
        return 'info';
      case 'premium':
        return 'success';
      default:
        return 'default';
    }
  };

  const renderFrequentFlyerStatus = (tier, miles) => {
    const tierLevels = {
      'platinum': 4,
      'gold': 3,
      'silver': 2,
      'bronze': 1,
    };

    const level = tierLevels[tier?.toLowerCase()] || 0;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {[...Array(4)].map((_, index) => (
          index < level ? (
            <StarIcon key={index} sx={{ fontSize: 16, color: 'gold' }} />
          ) : (
            <StarBorderIcon key={index} sx={{ fontSize: 16, color: 'grey.400' }} />
          )
        ))}
        <Typography variant="caption" sx={{ ml: 1 }}>
          {tier || 'None'}
        </Typography>
      </Box>
    );
  };

  const getLoyaltyProgress = () => {
    const tierMiles = {
      'bronze': 25000,
      'silver': 50000,
      'gold': 75000,
      'platinum': 100000,
    };

    const currentTier = passenger.frequentFlyerTier?.toLowerCase();
    const currentMiles = passenger.frequentFlyerMiles || 0;
    
    if (!currentTier || currentTier === 'platinum') {
      return { progress: 100, nextTier: null, milesNeeded: 0 };
    }

    const tiers = Object.keys(tierMiles);
    const currentIndex = tiers.indexOf(currentTier);
    const nextTier = tiers[currentIndex + 1];
    const nextTierMiles = tierMiles[nextTier];
    const progress = (currentMiles / nextTierMiles) * 100;

    return {
      progress: Math.min(progress, 100),
      nextTier,
      milesNeeded: nextTierMiles - currentMiles,
    };
  };

  const loyaltyData = getLoyaltyProgress();

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
      onClick={onSelect ? () => onSelect(passenger) : undefined}
    >
      <CardContent sx={{ flexGrow: 1, pb: compact ? 1 : 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {formatPassengerName(passenger.passengerName)}
            </Typography>
            {passenger.frequentFlyerNumber && (
              <Typography variant="body2" color="text.secondary">
                FF: {passenger.frequentFlyerNumber}
              </Typography>
            )}
          </Box>
          <Chip
            label={passenger.passengerType || 'Regular'}
            color={getPassengerTypeColor(passenger.passengerType)}
            size="small"
          />
        </Box>

        {!compact && (
          <>
            {/* Frequent Flyer Status */}
            {passenger.frequentFlyerTier && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Frequent Flyer Status
                </Typography>
                {renderFrequentFlyerStatus(passenger.frequentFlyerTier, passenger.frequentFlyerMiles)}
                
                {/* Loyalty Progress */}
                {loyaltyData.nextTier && loyaltyData.milesNeeded > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={loyaltyData.progress}
                      sx={{ height: 6, borderRadius: 1, mb: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatNumber(loyaltyData.milesNeeded)} miles to {loyaltyData.nextTier}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Key Metrics */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {formatNumber(passenger.totalFlights)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Flights
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {formatCurrency(passenger.totalSpent, passenger.currency)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Spent
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {formatCurrency(passenger.avgTicketValue, passenger.currency)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg Ticket
                </Typography>
              </Box>
            </Box>

            {/* Travel Preferences */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Travel Preferences
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={passenger.preferredClass || 'Economy'}
                  size="small"
                  variant="outlined"
                />
                {passenger.preferredAirline && (
                  <Chip
                    label={passenger.preferredAirline}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </>
        )}

        {/* Last Flight */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Last flight: {formatDate(passenger.lastFlightDate)}
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
          
          <Tooltip title="View Flight History">
            <IconButton
              size="small"
              onClick={() => navigate(`/passengers/${passenger.transactionNumber}/history`)}
            >
              <FlightIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};

export default PassengerCard;