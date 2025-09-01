// src/components/offices/OfficeTable.jsx
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
  Button,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatAgentCode,
  formatPercentage,
} from '../../utils/formatters';

const OfficeTable = ({
  offices = [],
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  selectedOffices = [],
  onSelectOffice,
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
      onSelectAll?.(offices.map(office => office.agentCode));
    } else {
      onSelectAll?.([]);
    }
  };

  const handleSelectOffice = (agentCode) => {
    onSelectOffice?.(agentCode);
  };

  const handleViewOffice = (agentCode) => {
    navigate(`/offices/${agentCode}`);
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

  const columns = [
    { id: 'agentCode', label: 'Agent Code', sortable: true },
    { id: 'officeName', label: 'Office Name', sortable: true },
    { id: 'country', label: 'Country', sortable: true },
    { id: 'currency', label: 'Currency', sortable: true },
    { id: 'totalRevenue', label: 'Total Revenue', sortable: true, align: 'right' },
    { id: 'transactionCount', label: 'Transactions', sortable: true, align: 'right' },
    { id: 'avgTicketValue', label: 'Avg Ticket Value', sortable: true, align: 'right' },
    { id: 'status', label: 'Status', sortable: true },
  ];

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading offices...</Typography>
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
                    selectedOffices.length > 0 && selectedOffices.length < offices.length
                  }
                  checked={offices.length > 0 && selectedOffices.length === offices.length}
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
          {offices.map((office) => (
            <TableRow
              key={office.agentCode}
              hover
              selected={selectedOffices.includes(office.agentCode)}
            >
              {showSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedOffices.includes(office.agentCode)}
                    onChange={() => handleSelectOffice(office.agentCode)}
                  />
                </TableCell>
              )}
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <BusinessIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="medium">
                    {formatAgentCode(office.agentCode)}
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {office.officeName || 'N/A'}
                </Typography>
                {office.city && (
                  <Typography variant="caption" color="text.secondary">
                    {office.revenueTrend > 0 ? '+' : ''}{formatPercentage(office.revenueTrend)}
                  </Typography>
                )}
              </TableCell>
              
              <TableCell align="right">
                <Typography variant="body2">
                  {formatNumber(office.transactionCount)}
                </Typography>
              </TableCell>
              
              <TableCell align="right">
                <Typography variant="body2">
                  {formatCurrency(office.avgTicketValue, office.currency)}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Chip
                  label={office.status || 'Active'}
                  color={getStatusColor(office.status)}
                  size="small"
                />
              </TableCell>
              
              {showActions && (
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleViewOffice(office.agentCode)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
          
          {offices.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (showSelection ? 1 : 0) + (showActions ? 1 : 0)}
                align="center"
                sx={{ py: 4 }}
              >
                <Typography color="text.secondary">
                  No offices found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OfficeTable;