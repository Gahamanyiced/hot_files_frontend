
// src/components/passengers/PassengerTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Person as PersonIcon,
  Flight as FlightIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatPassengerName,
} from '../../utils/formatters';

const PassengerTable = ({
  passengers = [],
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  selectedPassengers = [],
  onSelectPassenger,
  onSelectAll,
  showActions = true,
  showSelection = false,
}) => {
  const navigate = useNavigate();

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    onSort?.(column, isAsc ? 'desc' : 'asc');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      onSelectAll?.(passengers.map(passenger => passenger.id));
    } else {
      onSelectAll?.([]);
    }
  };

  const handleSelectPassenger = (id) => {
    onSelectPassenger?.(id);
  };

  const handleViewPassenger = (transactionNumber) => {
    navigate(`/passengers/${transactionNumber}`);
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

  const columns = [
    { id: 'passengerName', label: 'Passenger Name', sortable: true },
    { id: 'totalFlights', label: 'Total Flights', sortable: true, align: 'right' },
    { id: 'totalSpent', label: 'Total Spent', sortable: true, align: 'right' },
    { id: 'lastFlightDate', label: 'Last Flight', sortable: true },
    { id: 'frequentFlyerTier', label: 'FF Status', sortable: true },
    { id: 'passengerType', label: 'Type', sortable: true },
    { id: 'preferredClass', label: 'Preferred Class', sortable: true },
  ];

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading passengers...</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {showSelection && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedPassengers.length > 0 && selectedPassengers.length < passengers.length
                  }
                  checked={passengers.length > 0 && selectedPassengers.length === passengers.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
            )}
            
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sortDirection={sortBy === column.id ? sortOrder : false}
              >
                {column.sortable ? (
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sortOrder : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
            
            {showActions && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        
        <TableBody>
          {passengers.map((passenger) => (
            <TableRow
              key={passenger.id}
              hover
              selected={selectedPassengers.includes(passenger.id)}
            >
              {showSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedPassengers.includes(passenger.id)}
                    onChange={() => handleSelectPassenger(passenger.id)}
                  />
                </TableCell>
              )}
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {formatPassengerName(passenger.passengerName)}
                    </Typography>
                    {passenger.frequentFlyerNumber && (
                      <Typography variant="caption" color="text.secondary">
                        FF: {passenger.frequentFlyerNumber}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell align="right">
                <Typography variant="body2">
                  {formatNumber(passenger.totalFlights)}
                </Typography>
              </TableCell>
              
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(passenger.totalSpent, passenger.currency || 'USD')}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {formatDate(passenger.lastFlightDate)}
                </Typography>
              </TableCell>
              
              <TableCell>
                {renderFrequentFlyerStatus(passenger.frequentFlyerTier, passenger.frequentFlyerMiles)}
              </TableCell>
              
              <TableCell>
                <Chip
                  label={passenger.passengerType || 'Regular'}
                  color={getPassengerTypeColor(passenger.passengerType)}
                  size="small"
                />
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {passenger.preferredClass || 'Economy'}
                </Typography>
              </TableCell>
              
              {showActions && (
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleViewPassenger(passenger.transactionNumber)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
          
          {passengers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (showSelection ? 1 : 0) + (showActions ? 1 : 0)}
                align="center"
                sx={{ py: 4 }}
              >
                <Typography color="text.secondary">
                  No passengers found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PassengerTable;