// src/pages/ErrorLogs.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Button,
  Tabs,
  Tab,
  Chip,
  Alert,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Schedule as ProcessingIcon,
  Analytics as StatsIcon,
  Sync as RealtimeIcon, // Changed from RealTimeSync to Sync
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  fetchErrorLogs,
  fetchErrorStats,
  searchErrorLogs,
  bulkDeleteErrorLogs,
  setFilter,
  setPage,
  setPageSize,
  setSorting,
  setSelectedTab,
  setViewMode,
  toggleFilters,
  toggleErrorLogSelection,
  selectAllErrorLogs,
  clearErrorLogSelection,
  setSearchQuery,
  setRealtimeMode,
  setAutoRefresh,
  clearFilters,
} from '../store/slices/errorLogsSlice';
import { addNotification } from '../store/slices/uiSlice';

// Components
import DataTable from '../components/common/DataTable';
import MetricCard from '../components/dashboard/MetricCard';
import ErrorLogCard from '../components/errorLogs/ErrorLogCard';
import ErrorLogFilters from '../components/errorLogs/ErrorLogFilters';
import ErrorLogBulkActions from '../components/errorLogs/ErrorLogBulkActions';
import ErrorStatsOverview from '../components/errorLogs/ErrorStatsOverview';
import RealtimeMonitor from '../components/errorLogs/RealtimeMonitor';

// Utils
import {
  formatFileSize,
  formatDate,
  formatDuration,
  formatNumber,
} from '../utils/formatters';

const ErrorLogs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { errorLogs, stats, search, filters, ui, bulkOperations } =
    useAppSelector((state) => state.errorLogs);

  const { loading, data, pagination } = errorLogs;
  const [searchInput, setSearchInput] = React.useState('');

  // Load error logs on component mount and filter changes
  React.useEffect(() => {
    // Filter out empty string values before sending to API
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        // Handle date formatting for API
        if (key === 'startDate' || key === 'endDate') {
          if (value instanceof Date) {
            acc[key] = value.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
          } else if (value) {
            acc[key] = value;
          }
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

    dispatch(fetchErrorLogs(cleanFilters));
    dispatch(fetchErrorStats({ days: 30 }));
  }, [dispatch, filters]);

  // Auto-refresh functionality
  React.useEffect(() => {
    let interval;
    if (ui.autoRefresh && ui.realtimeMode) {
      interval = setInterval(() => {
        dispatch(fetchErrorLogs(filters));
        dispatch(fetchErrorStats({ days: 30 }));
      }, ui.refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dispatch, ui.autoRefresh, ui.realtimeMode, ui.refreshInterval, filters]);

  const handleRefresh = () => {
    dispatch(fetchErrorLogs(filters));
    dispatch(fetchErrorStats({ days: 30 }));
    dispatch(
      addNotification({
        type: 'info',
        message: 'Error logs refreshed',
        autoHideDuration: 2000,
      })
    );
  };

  const handleTabChange = (event, newValue) => {
    dispatch(setSelectedTab(newValue));
    if (newValue === 0) {
      dispatch(fetchErrorLogs(filters));
    } else if (newValue === 1) {
      dispatch(fetchErrorStats({ days: 30 }));
    }
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPageSize(newPageSize));
  };

  const handleSort = (columnId) => {
    const isAsc = ui.sortBy === columnId && ui.sortOrder === 'asc';
    dispatch(
      setSorting({
        sortBy: columnId,
        sortOrder: isAsc ? 'desc' : 'asc',
      })
    );
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput));
      dispatch(
        searchErrorLogs({
          q: searchInput,
          ...filters,
        })
      );
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleSearch();
  };

  const handleBulkDelete = () => {
    if (ui.selectedItems.length > 0) {
      dispatch(bulkDeleteErrorLogs(ui.selectedItems))
        .unwrap()
        .then(() => {
          dispatch(
            addNotification({
              type: 'success',
              message: `Successfully deleted ${ui.selectedItems.length} error logs`,
            })
          );
        })
        .catch((error) => {
          dispatch(
            addNotification({
              type: 'error',
              message: `Failed to delete error logs: ${error.message}`,
            })
          );
        });
    }
  };

  const handleToggleRealtime = () => {
    dispatch(setRealtimeMode(!ui.realtimeMode));
    dispatch(setAutoRefresh(!ui.autoRefresh));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <SuccessIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'processing':
        return <ProcessingIcon color="warning" />;
      default:
        return <WarningIcon color="disabled" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      id: 'uploadId',
      label: 'Upload ID',
      minWidth: 150,
      format: (value) => value.substring(0, 8) + '...',
    },
    {
      id: 'fileName',
      label: 'File Name',
      minWidth: 200,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value) => (
        <Chip
          icon={getStatusIcon(value)}
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'uploadedAt',
      label: 'Uploaded',
      minWidth: 150,
      format: (value) => formatDate(value),
    },
    {
      id: 'fileSize',
      label: 'File Size',
      minWidth: 100,
      format: (value) => formatFileSize(value),
    },
    {
      id: 'totalProcessed',
      label: 'Processed',
      minWidth: 100,
      format: (value) => formatNumber(value),
    },
    {
      id: 'totalErrors',
      label: 'Errors',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={formatNumber(value)}
          color={value > 0 ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      id: 'processingTime',
      label: 'Processing Time',
      minWidth: 130,
      format: (value) => formatDuration(value),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Error Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage HOT22 file processing errors
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip
            title={ui.realtimeMode ? 'Disable Real-time' : 'Enable Real-time'}
          >
            <IconButton
              onClick={handleToggleRealtime}
              color={ui.realtimeMode ? 'primary' : 'default'}
            >
              <RealtimeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Filter">
            <IconButton onClick={() => dispatch(toggleFilters())}>
              <FilterIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {
              /* Handle export */
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Real-time Status */}
      {ui.realtimeMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Real-time monitoring enabled - Auto-refreshing every{' '}
          {ui.refreshInterval / 1000} seconds
        </Alert>
      )}

      {/* Statistics Overview */}
      {stats.data && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Uploads"
              value={stats.data.totalUploads}
              icon={StatsIcon}
              color="primary"
              loading={stats.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Failed Uploads"
              value={stats.data.failedUploads}
              icon={ErrorIcon}
              color="error"
              loading={stats.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Success Rate"
              value={`${stats.data.successRate}%`}
              icon={SuccessIcon}
              color="success"
              loading={stats.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Errors"
              value={stats.data.totalErrors}
              icon={WarningIcon}
              color="warning"
              loading={stats.loading}
            />
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={ui.selectedTab} onChange={handleTabChange}>
          <Tab label="Error Logs" />
          <Tab label="Statistics" />
          <Tab label="Real-time Monitor" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {ui.selectedTab === 0 && (
        <Box>
          {/* Search and Filters */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSearchSubmit}>
                <TextField
                  fullWidth
                  placeholder="Search error logs..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) =>
                      handleFilterChange('status', e.target.value)
                    }
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Has Errors</InputLabel>
                  <Select
                    value={filters.hasErrors}
                    label="Has Errors"
                    onChange={(e) =>
                      handleFilterChange('hasErrors', e.target.value)
                    }
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">With Errors</MenuItem>
                    <MenuItem value="false">No Errors</MenuItem>
                  </Select>
                </FormControl>

                <Tooltip
                  title={ui.viewMode === 'table' ? 'Grid View' : 'Table View'}
                >
                  <IconButton
                    onClick={() =>
                      dispatch(
                        setViewMode(ui.viewMode === 'table' ? 'grid' : 'table')
                      )
                    }
                  >
                    {ui.viewMode === 'table' ? (
                      <ViewModuleIcon />
                    ) : (
                      <ViewListIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          {ui.showFilters && (
            <ErrorLogFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={() => dispatch(clearFilters())}
            />
          )}

          {/* Bulk Actions */}
          {ui.showBulkActions && (
            <ErrorLogBulkActions
              selectedCount={ui.selectedItems.length}
              onBulkDelete={handleBulkDelete}
              onClearSelection={() => dispatch(clearErrorLogSelection())}
              loading={bulkOperations.loading}
            />
          )}

          {/* Data Display */}
          {ui.viewMode === 'table' ? (
            <DataTable
              columns={columns}
              data={data}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSort={handleSort}
              sortBy={ui.sortBy}
              sortOrder={ui.sortOrder}
              selectable
              selectedItems={ui.selectedItems}
              onSelectionChange={(uploadId) =>
                dispatch(toggleErrorLogSelection(uploadId))
              }
              onSelectAll={() => dispatch(selectAllErrorLogs())}
              onClearSelection={() => dispatch(clearErrorLogSelection())}
              emptyMessage="No error logs found"
              rowAction={(row) => ({
                label: 'View Details',
                onClick: () => navigate(`/error-logs/${row.uploadId}`),
              })}
            />
          ) : (
            <Grid container spacing={3}>
              {data.map((errorLog) => (
                <Grid item xs={12} sm={6} md={4} key={errorLog.uploadId}>
                  <ErrorLogCard
                    errorLog={errorLog}
                    selected={ui.selectedItems.includes(errorLog.uploadId)}
                    onSelect={() =>
                      dispatch(toggleErrorLogSelection(errorLog.uploadId))
                    }
                    onClick={() => navigate(`/error-logs/${errorLog.uploadId}`)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {ui.selectedTab === 1 && (
        <ErrorStatsOverview
          stats={stats.data}
          loading={stats.loading}
          onRefresh={() => dispatch(fetchErrorStats({ days: 30 }))}
        />
      )}

      {ui.selectedTab === 2 && (
        <RealtimeMonitor
          enabled={ui.realtimeMode}
          interval={ui.refreshInterval}
          onToggle={handleToggleRealtime}
          onIntervalChange={(interval) =>
            dispatch(setRefreshInterval(interval))
          }
        />
      )}
    </Box>
  );
};

export default ErrorLogs;
