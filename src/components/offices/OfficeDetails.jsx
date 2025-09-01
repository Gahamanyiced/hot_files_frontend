// src/components/offices/OfficeDetails.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatAgentCode,
  formatPercentage,
  formatPhoneNumber,
} from '../../utils/formatters';

const OfficeDetails = ({ office, loading = false }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading office details...</Typography>
      </Box>
    );
  }

  if (!office) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No office data available</Typography>
      </Box>
    );
  }

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

  const getPerformanceLevel = (performance) => {
    if (performance >= 90) return { color: 'success', label: 'Excellent' };
    if (performance >= 75) return { color: 'info', label: 'Good' };
    if (performance >= 60) return { color: 'warning', label: 'Average' };
    return { color: 'error', label: 'Poor' };
  };

  const performanceData = office.performanceScore ? getPerformanceLevel(office.performanceScore) : null;

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
            <BusinessIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              {formatAgentCode(office.agentCode)}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {office.officeName || 'Office Name N/A'}
            </Typography>
          </Box>
          <Chip
            label={office.status || 'Active'}
            color={getStatusColor(office.status)}
            size="large"
          />
        </Box>

        {/* Key Metrics Row */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {formatCurrency(office.totalRevenue, office.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {formatNumber(office.transactionCount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Transactions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {formatCurrency(office.avgTicketValue, office.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Ticket Value
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {formatNumber(office.agentCount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Agents
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Office Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Office Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary={
                    office.address || 
                    (office.city && office.country 
                      ? `${office.city}, ${office.country}` 
                      : 'Address N/A')
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={formatPhoneNumber(office.phone) || 'N/A'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={office.email || 'N/A'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <MoneyIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Currency"
                  secondary={office.currency || 'USD'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Established"
                  secondary={formatDate(office.establishedDate) || 'N/A'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {/* Performance Score */}
            {office.performanceScore !== undefined && performanceData && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1">Overall Performance</Typography>
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
                  sx={{ height: 10, borderRadius: 1, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {office.performanceScore}% performance score
                </Typography>
              </Box>
            )}

            <List dense>
              <ListItem>
                <ListItemText
                  primary="Revenue Growth"
                  secondary={
                    office.revenueGrowth !== undefined
                      ? `${office.revenueGrowth > 0 ? '+' : ''}${formatPercentage(office.revenueGrowth)}`
                      : 'N/A'
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Transaction Growth"
                  secondary={
                    office.transactionGrowth !== undefined
                      ? `${office.transactionGrowth > 0 ? '+' : ''}${formatPercentage(office.transactionGrowth)}`
                      : 'N/A'
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Customer Satisfaction"
                  secondary={
                    office.customerSatisfaction !== undefined
                      ? `${office.customerSatisfaction}/5 stars`
                      : 'N/A'
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Market Share"
                  secondary={
                    office.marketShare !== undefined
                      ? formatPercentage(office.marketShare)
                      : 'N/A'
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        {office.recentActivity && office.recentActivity.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {office.recentActivity.map((activity, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={formatDate(activity.date)}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Additional Details */}
        {(office.timezone || office.workingHours || office.languages) && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Additional Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                {office.timezone && (
                  <ListItem>
                    <ListItemText
                      primary="Timezone"
                      secondary={office.timezone}
                    />
                  </ListItem>
                )}

                {office.workingHours && (
                  <ListItem>
                    <ListItemText
                      primary="Working Hours"
                      secondary={office.workingHours}
                    />
                  </ListItem>
                )}

                {office.languages && (
                  <ListItem>
                    <ListItemText
                      primary="Languages"
                      secondary={Array.isArray(office.languages) ? office.languages.join(', ') : office.languages}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default OfficeDetails;