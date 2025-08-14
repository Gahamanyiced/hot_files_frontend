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
  LinearProgress,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  fetchAllOffices,
  setFilter,
  setPage,
  setPageSize,
  setSorting,
  setViewMode,
  setSelectedTab,
  toggleOfficeSelection,
  selectAllOffices,
  clearOfficeSelection,
} from '../store/slices/officeSlice';
import { addNotification } from '../store/slices/uiSlice';

// Components
import DataTable from '../components/common/DataTable';
import MetricCard from '../components/dashboard/MetricCard';

// Utils
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatAgentCode,
} from '../utils/formatters';

const Offices = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { offices, filters, ui, pagination } = useAppSelector(
    (state) => state.offices
  );

  const { loading, data, error } = offices;

  // Load offices on component mount and filter changes
  React.useEffect(() => {
    dispatch(fetchAllOffices(filters));
  }, [dispatch, filters]);

  const handleRefresh = () => {
    dispatch(fetchAllOffices(filters));
    dispatch(
      addNotification({
        type: 'info',
        message: 'Offices data refreshed',
        autoHideDuration: 2000,
      })
    );
  };

  const handleSearch = (value) => {
    dispatch(setFilter({ key: 'search', value }));
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
      case 0: // All Offices
        dispatch(setFilter({ key: 'status', value: '' }));
        break;
      case 1: // Active Offices
        dispatch(setFilter({ key: 'status', value: 'active' }));
        break;
      case 2: // Top Performers
        dispatch(setSorting({ sortBy: 'revenue', sortOrder: 'desc' }));
        break;
      default:
        break;
    }
  };

  const handleRowSelection = (index) => {
    dispatch(toggleOfficeSelection(data[index]?.AGTN));
  };

  const handleSelectAll = (selectedIndices) => {
    if (selectedIndices.length === 0) {
      dispatch(clearOfficeSelection());
    } else {
      dispatch(selectAllOffices());
    }
  };

  // Office card component for grid view
  const OfficeCard = ({ office }) => (
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
      onClick={() => (window.location.href = `/offices/${office.AGTN}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            <BusinessIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {formatAgentCode(office.AGTN)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {office.stats?.officeTotals?.MLOC || 'N/A'}
            </Typography>
          </Box>
          <Chip label="Active" color="success" size="small" />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Transactions
            </Typography>
            <Typography variant="h6" color="primary">
              {formatNumber(office.stats?.transactionCount || 0)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Revenue
            </Typography>
            <Typography variant="h6" color="success.main">
              {formatCurrency(office.stats?.totalRevenue || 0)}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Performance
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min((office.stats?.transactionCount || 0) / 10, 100)}
            sx={{ height: 8, borderRadius: 4 }}
          />
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
            Last Active: {formatDate(office.lastActivity || new Date())}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {office.CUTP || 'USD'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // Table columns configuration
  const columns = [
    {
      id: 'AGTN',
      label: 'Agent Code',
      minWidth: 120,
      render: (value) => (
        <Typography variant="body2" fontFamily="monospace" fontWeight={500}>
          {formatAgentCode(value)}
        </Typography>
      ),
    },
    {
      id: 'MLOC',
      label: 'Location',
      minWidth: 100,
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationIcon
            fontSize="small"
            sx={{ mr: 1, color: 'text.secondary' }}
          />
          <Typography variant="body2">
            {row.stats?.officeTotals?.MLOC || value || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'transactionCount',
      label: 'Transactions',
      minWidth: 120,
      align: 'right',
      render: (value, row) => (
        <Box textAlign="right">
          <Typography variant="body2" fontWeight={500}>
            {formatNumber(row.stats?.transactionCount || 0)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            this period
          </Typography>
        </Box>
      ),
    },
    {
      id: 'totalRevenue',
      label: 'Revenue',
      minWidth: 120,
      align: 'right',
      render: (value, row) => (
        <Box textAlign="right">
          <Typography variant="body2" fontWeight={500} color="success.main">
            {formatCurrency(row.stats?.totalRevenue || 0)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.CUTP || 'USD'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'CUTP',
      label: 'Currency',
      minWidth: 80,
      render: (value) => (
        <Chip
          label={value || 'USD'}
          size="small"
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
        />
      ),
    },
    {
      id: 'RMED',
      label: 'Last Period',
      minWidth: 120,
      render: (value) => (
        <Typography variant="body2">{formatDate(value)}</Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (value, row) => {
        const isActive = row.stats?.transactionCount > 0;
        return (
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            color={isActive ? 'success' : 'default'}
            size="small"
          />
        );
      },
    },
  ];

  const tabLabels = ['All Offices', 'Active', 'Top Performers'];

  // Calculate summary metrics
  const totalOffices = data.length;
  const activeOffices = data.filter(
    (office) => office.stats?.transactionCount > 0
  ).length;
  const totalRevenue = data.reduce(
    (sum, office) => sum + (office.stats?.totalRevenue || 0),
    0
  );
  const totalTransactions = data.reduce(
    (sum, office) => sum + (office.stats?.transactionCount || 0),
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
          Office Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
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
            title="Total Offices"
            value={formatNumber(totalOffices)}
            icon={BusinessIcon}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Offices"
            value={formatNumber(activeOffices)}
            subtitle={`${((activeOffices / totalOffices) * 100).toFixed(
              1
            )}% active`}
            icon={TrendingUpIcon}
            color="success"
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
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Transactions"
            value={formatNumber(totalTransactions)}
            icon={PeopleIcon}
            color="warning"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search offices by agent code, location..."
          value={filters.search || ''}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
          disabled={loading}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={ui.selectedTab}
          onChange={handleTabChange}
          aria-label="office tabs"
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={index}
              label={label}
              id={`office-tab-${index}`}
              aria-controls={`office-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Summary */}
      {pagination && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            label={`${pagination.totalRecords} offices`}
            color="primary"
            variant="outlined"
          />
          {ui.selectedOffices.length > 0 && (
            <Chip
              label={`${ui.selectedOffices.length} selected`}
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
          selectedRows={ui.selectedOffices
            .map((agtn) => data.findIndex((row) => row.AGTN === agtn))
            .filter((index) => index !== -1)}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          onSelectRow={handleRowSelection}
          onSelectAll={handleSelectAll}
          onRefresh={handleRefresh}
          emptyMessage="No offices found"
        />
      ) : (
        /* Grid View */
        <Box>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={{ height: 200 }}>
                    <CardContent>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <Avatar sx={{ mr: 2 }}>
                          <BusinessIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress />
                        </Box>
                      </Box>
                      <LinearProgress sx={{ mb: 1 }} />
                      <LinearProgress sx={{ mb: 1 }} />
                      <LinearProgress />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : data.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BusinessIcon
                sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No offices found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {data.map((office, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={office.AGTN || index}
                >
                  <OfficeCard office={office} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Offices;
