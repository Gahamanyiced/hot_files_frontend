import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Avatar,
  useTheme,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Person as PersonIcon,
  Flight as FlightIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  fetchPassengers,
  setFilter,
  setPage,
  setPageSize,
  setSorting,
  setSearch,
  setDateRange,
  setViewMode,
  setSelectedTab,
  togglePassengerSelection,
  selectAllPassengers,
  clearPassengerSelection,
} from '../store/slices/customerSlice';
import { addNotification } from '../store/slices/uiSlice';

// Components
import DataTable from '../components/common/DataTable';
import MetricCard from '../components/dashboard/MetricCard';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatPassengerName,
} from '../utils/formatters';

const Passengers = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { passengers, filters, ui, pagination } = useAppSelector(
    (state) => state.customers
  );

  const { loading, data, error } = passengers;

  // Load passengers on component mount and filter changes
  React.useEffect(() => {
    dispatch(fetchPassengers(filters));
  }, [dispatch, filters]);

  const handleRefresh = () => {
    dispatch(fetchPassengers(filters));
    dispatch(
      addNotification({
        type: 'info',
        message: 'Passengers data refreshed',
        autoHideDuration: 2000,
      })
    );
  };

  const handleSearch = (value) => {
    dispatch(setSearch(value));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPageSize(newPageSize));
  };

  const handleSort = (columnId) => {
    const isAsc = filters.sortBy === columnId && filters.sortOrder === 'asc';
    dispatch(
      setSorting({
        sortBy: columnId,
        sortOrder: isAsc ? 'desc' : 'asc',
      })
    );
  };

  const handleTabChange = (event, newValue) => {
    dispatch(setSelectedTab(newValue));
    // Apply different filters based on tab
    switch (newValue) {
      case 0: // All Passengers
        dispatch(setFilter({ key: 'passengerType', value: '' }));
        break;
      case 1: // Recent Passengers (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dispatch(
          setDateRange({
            dateFrom: thirtyDaysAgo
              .toISOString()
              .slice(2, 10)
              .replace(/-/g, ''),
            dateTo: new Date().toISOString().slice(2, 10).replace(/-/g, ''),
          })
        );
        break;
      case 2: // Frequent Travelers
        dispatch(setSorting({ sortBy: 'tripCount', sortOrder: 'desc' }));
        break;
      default:
        break;
    }
  };

  const handleRowSelection = (index) => {
    dispatch(togglePassengerSelection(data[index]?.TRNN));
  };

  const handleSelectAll = (selectedIndices) => {
    if (selectedIndices.length === 0) {
      dispatch(clearPassengerSelection());
    } else {
      dispatch(selectAllPassengers());
    }
  };

  const handleDateRangeChange = (field, value) => {
    if (value) {
      const formattedDate = value.toISOString().slice(2, 10).replace(/-/g, '');
      dispatch(
        setDateRange({
          ...filters,
          [field]: formattedDate,
        })
      );
    } else {
      dispatch(
        setDateRange({
          ...filters,
          [field]: '',
        })
      );
    }
  };

  // Passenger card component for grid view
  const PassengerCard = ({ passenger }) => (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
      }}
      onClick={() => (window.location.href = `/passengers/${passenger.TRNN}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.secondary.main,
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={600} noWrap>
              {formatPassengerName(passenger.PXNM)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              TXN-{passenger.TRNN}
            </Typography>
          </Box>
          <Chip
            label={passenger.PXTP || 'ADT'}
            size="small"
            color={passenger.PXTP === 'CHD' ? 'warning' : 'default'}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Issue Date
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatDate(passenger.DAIS)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="body2" fontWeight={500} color="success.main">
              {formatCurrency(passenger.TDAM)}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Route
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlightIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              {passenger.route || 'Multiple segments'}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Agent: {passenger.AGTN}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {passenger.CUTP || 'USD'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // Table columns configuration
  const columns = [
    {
      id: 'PXNM',
      label: 'Passenger Name',
      minWidth: 180,
      render: (value) => (
        <Typography variant="body2" fontWeight={500}>
          {formatPassengerName(value)}
        </Typography>
      ),
    },
    {
      id: 'TRNN',
      label: 'Transaction #',
      minWidth: 120,
      render: (value) => (
        <Typography variant="body2" fontFamily="monospace">
          TXN-{value}
        </Typography>
      ),
    },
    {
      id: 'PXTP',
      label: 'Type',
      minWidth: 80,
      render: (value) => (
        <Chip
          label={value || 'ADT'}
          size="small"
          color={
            value === 'CHD' ? 'warning' : value === 'INF' ? 'info' : 'default'
          }
        />
      ),
    },
    {
      id: 'DAIS',
      label: 'Issue Date',
      minWidth: 100,
      render: (value) => formatDate(value),
    },
    {
      id: 'TDAM',
      label: 'Amount',
      minWidth: 120,
      align: 'right',
      render: (value, row) => (
        <Box textAlign="right">
          <Typography variant="body2" fontWeight={500} color="success.main">
            {formatCurrency(value)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.CUTP || 'USD'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'route',
      label: 'Route',
      minWidth: 150,
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightIcon fontSize="small" color="primary" />
          <Typography variant="body2" noWrap>
            {value || 'Multiple segments'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'AGTN',
      label: 'Agent',
      minWidth: 100,
      render: (value) => (
        <Typography variant="body2" fontFamily="monospace">
          {value}
        </Typography>
      ),
    },
    {
      id: 'tripCount',
      label: 'Trips',
      minWidth: 80,
      align: 'center',
      render: (value) => (
        <Chip
          label={value || 1}
          size="small"
          variant="outlined"
          color={value > 5 ? 'primary' : 'default'}
        />
      ),
    },
  ];

  const tabLabels = ['All Passengers', 'Recent', 'Frequent Travelers'];

  // Calculate summary metrics
  const totalPassengers = data.length;
  const adultPassengers = data.filter(
    (p) => !p.PXTP || p.PXTP === 'ADT'
  ).length;
  const childPassengers = data.filter((p) => p.PXTP === 'CHD').length;
  const totalRevenue = data.reduce(
    (sum, p) => sum + (parseFloat(p.TDAM) || 0),
    0
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Passenger Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Export Passengers">
            <IconButton disabled={loading || data.length === 0}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={`Switch to ${
              ui.viewMode === 'table' ? 'Grid' : 'Table'
            } View`}
          >
            <IconButton
              onClick={() =>
                dispatch(
                  setViewMode(ui.viewMode === 'table' ? 'cards' : 'table')
                )
              }
            >
              {ui.viewMode === 'table' ? <ViewModuleIcon /> : <ViewListIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Summary Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Passengers"
            value={formatNumber(totalPassengers)}
            icon={PersonIcon}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Adult Passengers"
            value={formatNumber(adultPassengers)}
            subtitle={`${((adultPassengers / totalPassengers) * 100).toFixed(
              1
            )}% of total`}
            icon={PersonIcon}
            color="success"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Child Passengers"
            value={formatNumber(childPassengers)}
            subtitle={`${((childPassengers / totalPassengers) * 100).toFixed(
              1
            )}% of total`}
            icon={PersonIcon}
            color="warning"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={MoneyIcon}
            color="info"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search passengers by name, transaction..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <DatePicker
            label="From Date"
            value={
              filters.dateFrom
                ? new Date(
                    `20${filters.dateFrom.slice(0, 2)}-${filters.dateFrom.slice(
                      2,
                      4
                    )}-${filters.dateFrom.slice(4, 6)}`
                  )
                : null
            }
            onChange={(value) => handleDateRangeChange('dateFrom', value)}
            slotProps={{ textField: { fullWidth: true, size: 'medium' } }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <DatePicker
            label="To Date"
            value={
              filters.dateTo
                ? new Date(
                    `20${filters.dateTo.slice(0, 2)}-${filters.dateTo.slice(
                      2,
                      4
                    )}-${filters.dateTo.slice(4, 6)}`
                  )
                : null
            }
            onChange={(value) => handleDateRangeChange('dateTo', value)}
            slotProps={{ textField: { fullWidth: true, size: 'medium' } }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Passenger Type</InputLabel>
            <Select
              value={filters.passengerType || ''}
              label="Passenger Type"
              onChange={(e) =>
                dispatch(
                  setFilter({ key: 'passengerType', value: e.target.value })
                )
              }
              disabled={loading}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="ADT">Adult</MenuItem>
              <MenuItem value="CHD">Child</MenuItem>
              <MenuItem value="INF">Infant</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Page Size</InputLabel>
            <Select
              value={filters.limit || 50}
              label="Page Size"
              onChange={(e) => handlePageSizeChange(e.target.value)}
              disabled={loading}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={ui.selectedTab}
          onChange={handleTabChange}
          aria-label="passenger tabs"
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={index}
              label={label}
              id={`passenger-tab-${index}`}
              aria-controls={`passenger-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Summary */}
      {pagination && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            label={`${pagination.totalRecords} passengers`}
            color="primary"
            variant="outlined"
          />
          {ui.selectedPassengers.length > 0 && (
            <Chip
              label={`${ui.selectedPassengers.length} selected`}
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Content */}
      {ui.viewMode === 'table' ? (
        /* Table View */
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          error={error}
          pagination={pagination}
          selectable={true}
          selectedRows={ui.selectedPassengers
            .map((trnn) => data.findIndex((row) => row.TRNN === trnn))
            .filter((index) => index !== -1)}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          onSelectRow={handleRowSelection}
          onSelectAll={handleSelectAll}
          onRefresh={handleRefresh}
          emptyMessage="No passengers found"
        />
      ) : (
        /* Grid View */
        <Box>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(8)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={{ height: 200 }}>
                    <CardContent>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <Avatar sx={{ mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box
                            sx={{
                              height: 20,
                              bgcolor: 'grey.200',
                              mb: 1,
                              borderRadius: 1,
                            }}
                          />
                          <Box
                            sx={{
                              height: 16,
                              bgcolor: 'grey.200',
                              borderRadius: 1,
                              width: '60%',
                            }}
                          />
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          height: 16,
                          bgcolor: 'grey.200',
                          mb: 1,
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          height: 16,
                          bgcolor: 'grey.200',
                          mb: 1,
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          height: 16,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          width: '80%',
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : data.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <PersonIcon
                sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No passengers found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or date range
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {data.map((passenger, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={passenger.TRNN || index}
                >
                  <PassengerCard passenger={passenger} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Passengers;
