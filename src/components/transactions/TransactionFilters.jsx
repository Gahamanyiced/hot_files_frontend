import React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Autocomplete,
  Paper,
  IconButton,
  Tooltip,
  Collapse,
  Typography,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const TransactionFilters = ({ filters, onFilterChange, loading = false }) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Predefined options
  const transactionCodes = [
    { value: '', label: 'All Types' },
    { value: 'STD', label: 'Standard' },
    { value: 'RFND', label: 'Refund' },
    { value: 'EXCH', label: 'Exchange' },
    { value: 'VOID', label: 'Void' },
    { value: 'EMD', label: 'EMD' },
  ];

  const currencies = [
    { value: '', label: 'All Currencies' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'CAD', label: 'CAD' },
    { value: 'JPY', label: 'JPY' },
  ];

  const pageSizes = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  const sortOptions = [
    { value: 'DAIS', label: 'Issue Date' },
    { value: 'TRNN', label: 'Transaction Number' },
    { value: 'TDNR', label: 'Ticket Number' },
    { value: 'AGTN', label: 'Agent Code' },
    { value: 'TDAM', label: 'Amount' },
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange(key, value);
  };

  const handleClearFilters = () => {
    onFilterChange('search', '');
    onFilterChange('agentCode', '');
    onFilterChange('startDate', '');
    onFilterChange('endDate', '');
    onFilterChange('ticketNumber', '');
    onFilterChange('transactionCode', '');
    onFilterChange('passengerName', '');
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.agentCode ||
      filters.startDate ||
      filters.endDate ||
      filters.ticketNumber ||
      filters.transactionCode ||
      filters.passengerName
    );
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.agentCode) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.ticketNumber) count++;
    if (filters.transactionCode) count++;
    if (filters.passengerName) count++;
    return count;
  };

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Filters</Typography>
          {hasActiveFilters() && (
            <Chip 
              label={`${getFilterCount()} active`}
              color="primary"
              size="small"
              onDelete={handleClearFilters}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowAdvanced(!showAdvanced)}
            endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            Advanced
          </Button>
          {hasActiveFilters() && (
            <Tooltip title="Clear all filters">
              <IconButton size="small" onClick={handleClearFilters}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Basic Filters */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search"
            placeholder="Transaction, ticket, passenger..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Agent Code"
            placeholder="e.g., 12345678"
            value={filters.agentCode || ''}
            onChange={(e) => handleFilterChange('agentCode', e.target.value)}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Transaction Type</InputLabel>
            <Select
              value={filters.transactionCode || ''}
              label="Transaction Type"
              onChange={(e) => handleFilterChange('transactionCode', e.target.value)}
              disabled={loading}
            >
              {transactionCodes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Page Size</InputLabel>
            <Select
              value={filters.limit || 50}
              label="Page Size"
              onChange={(e) => handleFilterChange('limit', e.target.value)}
              disabled={loading}
            >
              {pageSizes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      <Collapse in={showAdvanced}>
        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Advanced Filters
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate ? new Date(`20${filters.startDate.slice(0,2)}-${filters.startDate.slice(2,4)}-${filters.startDate.slice(4,6)}`) : null}
                  onChange={(date) => {
                    if (date) {
                      const formattedDate = date.toISOString().slice(2, 10).replace(/-/g, '');
                      handleFilterChange('startDate', formattedDate);
                    } else {
                      handleFilterChange('startDate', '');
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth disabled={loading} />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate ? new Date(`20${filters.endDate.slice(0,2)}-${filters.endDate.slice(2,4)}-${filters.endDate.slice(4,6)}`) : null}
                  onChange={(date) => {
                    if (date) {
                      const formattedDate = date.toISOString().slice(2, 10).replace(/-/g, '');
                      handleFilterChange('endDate', formattedDate);
                    } else {
                      handleFilterChange('endDate', '');
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth disabled={loading} />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Ticket Number"
                placeholder="e.g., 123-4567890123"
                value={filters.ticketNumber || ''}
                onChange={(e) => handleFilterChange('ticketNumber', e.target.value)}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Passenger Name"
                placeholder="Search by passenger name"
                value={filters.passengerName || ''}
                onChange={(e) => handleFilterChange('passengerName', e.target.value)}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy || 'DAIS'}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  disabled={loading}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort Order</InputLabel>
                <Select
                  value={filters.sortOrder || 'desc'}
                  label="Sort Order"
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={filters.currency || ''}
                  label="Currency"
                  onChange={(e) => handleFilterChange('currency', e.target.value)}
                  disabled={loading}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Amount Range Filters */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min Amount"
                type="number"
                placeholder="0.00"
                value={filters.minAmount || ''}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Max Amount"
                type="number"
                placeholder="10000.00"
                value={filters.maxAmount || ''}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Grid>
          </Grid>

          {/* Quick Filter Chips */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Quick Filters
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Today"
                variant={filters.startDate === new Date().toISOString().slice(2, 10).replace(/-/g, '') ? 'filled' : 'outlined'}
                onClick={() => {
                  const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');
                  handleFilterChange('startDate', today);
                  handleFilterChange('endDate', today);
                }}
                size="small"
              />
              <Chip
                label="Last 7 Days"
                variant="outlined"
                onClick={() => {
                  const today = new Date();
                  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  handleFilterChange('startDate', sevenDaysAgo.toISOString().slice(2, 10).replace(/-/g, ''));
                  handleFilterChange('endDate', today.toISOString().slice(2, 10).replace(/-/g, ''));
                }}
                size="small"
              />
              <Chip
                label="Last 30 Days"
                variant="outlined"
                onClick={() => {
                  const today = new Date();
                  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                  handleFilterChange('startDate', thirtyDaysAgo.toISOString().slice(2, 10).replace(/-/g, ''));
                  handleFilterChange('endDate', today.toISOString().slice(2, 10).replace(/-/g, ''));
                }}
                size="small"
              />
              <Chip
                label="This Month"
                variant="outlined"
                onClick={() => {
                  const today = new Date();
                  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                  handleFilterChange('startDate', firstDay.toISOString().slice(2, 10).replace(/-/g, ''));
                  handleFilterChange('endDate', today.toISOString().slice(2, 10).replace(/-/g, ''));
                }}
                size="small"
              />
              <Chip
                label="Refunds Only"
                variant={filters.transactionCode === 'RFND' ? 'filled' : 'outlined'}
                color={filters.transactionCode === 'RFND' ? 'primary' : 'default'}
                onClick={() => handleFilterChange('transactionCode', filters.transactionCode === 'RFND' ? '' : 'RFND')}
                size="small"
              />
              <Chip
                label="High Value (>$1000)"
                variant="outlined"
                onClick={() => {
                  handleFilterChange('minAmount', '1000');
                }}
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Active Filters
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.search && (
              <Chip
                label={`Search: ${filters.search}`}
                onDelete={() => handleFilterChange('search', '')}
                size="small"
                color="primary"
              />
            )}
            {filters.agentCode && (
              <Chip
                label={`Agent: ${filters.agentCode}`}
                onDelete={() => handleFilterChange('agentCode', '')}
                size="small"
                color="primary"
              />
            )}
            {filters.transactionCode && (
              <Chip
                label={`Type: ${transactionCodes.find(t => t.value === filters.transactionCode)?.label}`}
                onDelete={() => handleFilterChange('transactionCode', '')}
                size="small"
                color="primary"
              />
            )}
            {filters.startDate && (
              <Chip
                label={`From: ${filters.startDate}`}
                onDelete={() => handleFilterChange('startDate', '')}
                size="small"
                color="primary"
              />
            )}
            {filters.endDate && (
              <Chip
                label={`To: ${filters.endDate}`}
                onDelete={() => handleFilterChange('endDate', '')}
                size="small"
                color="primary"
              />
            )}
            {filters.ticketNumber && (
              <Chip
                label={`Ticket: ${filters.ticketNumber}`}
                onDelete={() => handleFilterChange('ticketNumber', '')}
                size="small"
                color="primary"
              />
            )}
            {filters.passengerName && (
              <Chip
                label={`Passenger: ${filters.passengerName}`}
                onDelete={() => handleFilterChange('passengerName', '')}
                size="small"
                color="primary"
              />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default TransactionFilters;