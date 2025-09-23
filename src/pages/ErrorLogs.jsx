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
  Sync as RealtimeIcon,
  Visibility as VisibilityIcon,
  CloudUpload as UploadIcon,
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
  setRefreshInterval,
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

  // Table columns configuration - Using actual API response fields
  const columns = [
    {
      id: 'fileName',
      label: 'File Name',
      minWidth: 200,
      sortable: true,
      render: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight="medium" noWrap title={value}>
            {value || 'Unknown File'}
          </Typography>
          {row.fileSize && (
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(row.fileSize)}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      sortable: true,
      render: (value) => (
        <Chip
          label={value?.charAt(0).toUpperCase() + value?.slice(1) || 'Unknown'}
          color={getStatusColor(value)}
          size="small"
          icon={getStatusIcon(value)}
        />
      ),
    },
    {
      id: 'totalProcessed',
      label: 'Total Processed',
      minWidth: 130,
      align: 'right',
      sortable: true,
      render: (value) => (
        <Typography variant="body2" fontWeight="medium">
          {formatNumber(value || 0)}
        </Typography>
      ),
    },
    {
      id: 'totalSaved',
      label: 'Saved',
      minWidth: 100,
      align: 'right',
      sortable: true,
      render: (value) => (
        <Typography variant="body2" color="success.main">
          {formatNumber(value || 0)}
        </Typography>
      ),
    },
    {
      id: 'totalErrors',
      label: 'Errors',
      minWidth: 100,
      align: 'right',
      sortable: true,
      render: (value) => (
        <Chip
          label={formatNumber(value || 0)}
          color={value > 0 ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      id: 'uploadedAt',
      label: 'Upload Time',
      minWidth: 130,
      sortable: true,
      render: (value) => (
        <Typography variant="body2">
          {value ? formatDate(value) : 'N/A'}
        </Typography>
      ),
    },
  ];

  // Event handlers
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
      dispatch(searchErrorLogs({ query: searchInput, ...filters }));
    }
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchInput('');
  };

  const handleToggleRealtime = () => {
    const newRealtimeMode = !ui.realtimeMode;
    dispatch(setRealtimeMode(newRealtimeMode));
    dispatch(setAutoRefresh(newRealtimeMode));
  };

  const handleBulkDelete = () => {
    if (ui.selectedItems.length > 0) {
      dispatch(bulkDeleteErrorLogs(ui.selectedItems));
    }
  };

  const handleExport = () => {
    dispatch(
      addNotification({
        type: 'info',
        message: 'Export functionality will be implemented soon',
      })
    );
  };

  // Utility functions
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <SuccessIcon />;
      case 'failed':
        return <ErrorIcon />;
      case 'processing':
        return <ProcessingIcon />;
      default:
        return null;
    }
  };

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
            <span>
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Total Uploads"
              value={stats.data.totalUploads || 0}
              icon={UploadIcon}
              color="primary"
              loading={stats.loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Failed Uploads"
              value={stats.data.failedUploads || 0}
              icon={ErrorIcon}
              color="error"
              loading={stats.loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Success Rate"
              value={`${stats.data.successRate || 0}%`}
              icon={SuccessIcon}
              color="success"
              loading={stats.loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Avg Processing Time"
              value={
                stats.data.avgProcessingTime
                  ? `${stats.data.avgProcessingTime}ms`
                  : 'N/A'
              }
              icon={ProcessingIcon}
              color="info"
              loading={stats.loading}
            />
          </Grid>
        </Grid>
      )}

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search error logs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleSearch}
                  disabled={!searchInput.trim()}
                >
                  Search
                </Button>
                <Button variant="outlined" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
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
              onClearFilters={handleClearFilters}
            />
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={ui.selectedTab} onChange={handleTabChange}>
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Error Logs
                {data.length > 0 && (
                  <Chip label={data.length} size="small" color="primary" />
                )}
              </Box>
            }
          />
          <Tab label="Statistics" />
          <Tab label="Real-time Monitor" />
        </Tabs>
      </Box>

      {/* Bulk Actions */}
      {ui.selectedItems.length > 0 && (
        <ErrorLogBulkActions
          selectedCount={ui.selectedItems.length}
          onDelete={handleBulkDelete}
          onExport={handleExport}
          loading={bulkOperations.loading}
        />
      )}

      {/* Content Tabs */}
      {ui.selectedTab === 0 && (
        <Box>
          {ui.viewMode === 'table' ? (
            <DataTable
              columns={columns}
              data={data}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handlePageSizeChange}
              onSort={handleSort}
              sortable
              selectable
              selectedRows={ui.selectedItems.map((uploadId) =>
                data.findIndex((item) => item.uploadId === uploadId)
              )}
              onSelectAll={(indexes) => {
                if (indexes.length === 0) {
                  dispatch(clearErrorLogSelection());
                } else {
                  dispatch(selectAllErrorLogs());
                }
              }}
              onSelectRow={(index) => {
                if (data[index]) {
                  dispatch(toggleErrorLogSelection(data[index].uploadId));
                }
              }}
              emptyMessage="No error logs found"
              rowAction={(row) => ({
                label: 'View Details',
                icon: <VisibilityIcon />,
                onClick: () => navigate(`/error-logs/${row.uploadId}`),
              })}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          ) : (
            <Grid container spacing={3}>
              {data.map((errorLog) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={errorLog.uploadId}>
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
          interval={ui.refreshInterval / 1000} // Convert to seconds
          onToggle={handleToggleRealtime}
          onIntervalChange={
            (interval) => dispatch(setRefreshInterval(interval * 1000)) // Convert to milliseconds
          }
        />
      )}
    </Box>
  );
};

export default ErrorLogs;
