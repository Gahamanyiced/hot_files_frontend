import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

const MetricCard = ({
  title,
  value,
  change,
  trend = 'up', // 'up' | 'down' | 'neutral'
  icon: Icon,
  color = 'primary',
  loading = false,
  onClick,
  subtitle,
  formatter,
}) => {
  const theme = useTheme();

  const colorMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    warning: theme.palette.warning,
    error: theme.palette.error,
    info: theme.palette.info,
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon fontSize="small" />;
      case 'down':
        return <TrendingDownIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formattedValue = formatter ? formatter(value) : value;

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[8],
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>

            {loading ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: selectedColor.main,
                  mb: subtitle ? 0.5 : 1,
                }}
              >
                {formattedValue}
              </Typography>
            )}

            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {subtitle}
              </Typography>
            )}

            {change && !loading && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: getTrendColor(),
                }}
              >
                {getTrendIcon()}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: getTrendColor(),
                  }}
                >
                  {change}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs last period
                </Typography>
              </Box>
            )}
          </Box>

          {Icon && (
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(selectedColor.main, 0.1),
                color: selectedColor.main,
                ml: 2,
              }}
            >
              {loading ? (
                <Skeleton variant="circular" width={32} height={32} />
              ) : (
                <Icon sx={{ fontSize: 32 }} />
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
