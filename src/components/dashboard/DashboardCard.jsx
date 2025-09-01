// src/components/dashboard/DashboardCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
  Avatar,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Utils
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: IconComponent,
  trend,
  trendLabel,
  progress,
  progressLabel,
  color = 'primary',
  variant = 'default',
  loading = false,
  error = null,
  actions = [],
  onClick,
  onRefresh,
  footer,
  size = 'medium',
  elevation = 1,
  showTrend = true,
  showProgress = false,
  customContent,
  formatValue = 'number',
  currency = 'USD',
}) => {
  const theme = useTheme();

  // Format the main value based on type
  const getFormattedValue = () => {
    if (value === null || value === undefined) return '--';
    
    switch (formatValue) {
      case 'currency':
        return formatCurrency(value, currency);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
        return formatNumber(value);
      default:
        return value;
    }
  };

  // Get trend icon and color
  const getTrendDisplay = () => {
    if (!showTrend || trend === undefined || trend === null) return null;

    const trendValue = parseFloat(trend);
    let TrendIcon;
    let trendColor;

    if (trendValue > 0) {
      TrendIcon = TrendingUpIcon;
      trendColor = 'success.main';
    } else if (trendValue < 0) {
      TrendIcon = TrendingDownIcon;
      trendColor = 'error.main';
    } else {
      TrendIcon = TrendingFlatIcon;
      trendColor = 'text.secondary';
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TrendIcon sx={{ fontSize: 16, color: trendColor }} />
        <Typography variant="caption" sx={{ color: trendColor }}>
          {Math.abs(trendValue)}%
        </Typography>
        {trendLabel && (
          <Typography variant="caption" color="text.secondary">
            {trendLabel}
          </Typography>
        )}
      </Box>
    );
  };

  // Get card dimensions based on size
  const getCardSize = () => {
    switch (size) {
      case 'small':
        return { minHeight: 120, padding: 2 };
      case 'large':
        return { minHeight: 200, padding: 3 };
      default:
        return { minHeight: 160, padding: 2.5 };
    }
  };

  const cardSize = getCardSize();
  const colorValue = theme.palette[color]?.main || color;

  // Handle loading state
  if (loading) {
    return (
      <Card
        elevation={elevation}
        sx={{
          ...cardSize,
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <CardContent sx={{ p: cardSize.padding }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {IconComponent && (
              <Avatar
                sx={{
                  bgcolor: alpha(colorValue, 0.1),
                  color: colorValue,
                  mr: 2,
                  width: 48,
                  height: 48,
                }}
              >
                <IconComponent />
              </Avatar>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="text.secondary">
                {title}
              </Typography>
            </Box>
          </Box>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card
        elevation={elevation}
        sx={{
          ...cardSize,
          border: 1,
          borderColor: 'error.light',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <CardContent sx={{ p: cardSize.padding }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {IconComponent && (
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: 'error.main',
                  mr: 2,
                  width: 48,
                  height: 48,
                }}
              >
                <IconComponent />
              </Avatar>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="error">
                {title}
              </Typography>
            </Box>
            {onRefresh && (
              <IconButton size="small" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            )}
          </Box>
          <Typography variant="body2" color="error.main">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={elevation}
      sx={{
        ...cardSize,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          elevation: elevation + 2,
          transform: 'translateY(-2px)',
        } : {},
        ...(variant === 'outlined' && {
          border: 1,
          borderColor: 'divider',
          elevation: 0,
        }),
        ...(variant === 'gradient' && {
          background: `linear-gradient(135deg, ${colorValue} 0%, ${alpha(colorValue, 0.7)} 100%)`,
          color: 'white',
        }),
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: cardSize.padding, pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {IconComponent && (
            <Avatar
              sx={{
                bgcolor: variant === 'gradient' 
                  ? alpha(theme.palette.common.white, 0.2)
                  : alpha(colorValue, 0.1),
                color: variant === 'gradient' 
                  ? 'white'
                  : colorValue,
                mr: 2,
                width: size === 'large' ? 56 : 48,
                height: size === 'large' ? 56 : 48,
              }}
            >
              <IconComponent />
            </Avatar>
          )}
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              color={variant === 'gradient' ? 'inherit' : 'text.secondary'}
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                color={variant === 'gradient' ? 'inherit' : 'text.secondary'}
                sx={{ opacity: 0.8 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Actions Menu */}
          {actions.length > 0 && (
            <IconButton 
              size="small"
              sx={{ 
                color: variant === 'gradient' ? 'white' : 'text.secondary',
                opacity: 0.7,
                '&:hover': { opacity: 1 }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

        {/* Custom Content or Default Value Display */}
        {customContent || (
          <Box>
            {/* Main Value */}
            <Typography 
              variant={size === 'large' ? 'h3' : 'h4'} 
              color={variant === 'gradient' ? 'inherit' : colorValue}
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                lineHeight: 1.2 
              }}
            >
              {getFormattedValue()}
            </Typography>

            {/* Trend Indicator */}
            {getTrendDisplay()}

            {/* Progress Bar */}
            {showProgress && progress !== undefined && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {progressLabel || 'Progress'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  color={color}
                  sx={{ 
                    height: 6, 
                    borderRadius: 1,
                    bgcolor: variant === 'gradient' 
                      ? alpha(theme.palette.common.white, 0.2)
                      : alpha(colorValue, 0.1)
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </CardContent>

      {/* Footer Actions */}
      {(footer || actions.length > 0) && (
        <CardActions sx={{ px: cardSize.padding, pt: 0 }}>
          {footer}
          {actions.map((action, index) => (
            <Button
              key={index}
              size="small"
              startIcon={action.icon}
              onClick={action.onClick}
              color={variant === 'gradient' ? 'inherit' : action.color || 'primary'}
              sx={{
                color: variant === 'gradient' ? 'white' : undefined,
                '&:hover': variant === 'gradient' ? {
                  bgcolor: alpha(theme.palette.common.white, 0.1)
                } : undefined
              }}
            >
              {action.label}
            </Button>
          ))}
        </CardActions>
      )}
    </Card>
  );
};

export default DashboardCard;