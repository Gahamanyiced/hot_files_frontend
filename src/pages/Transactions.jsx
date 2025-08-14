import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';

// Components
import DataTable from '../components/common/DataTable';
import TransactionFilters from '../components/transactions/TransactionFilters';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  fetchTransactions,
  setFilter,
  setPage,
  setPageSize,
  setSorting,
  toggleFilters,
  setSelectedTab,
  setViewMode,
  toggleTransactionSelection,
  selectAllTransactions,
  clearTransactionSelection,
} from '../store/slices/transactionSlice';
import { addNotification } from '../store/slices/uiSlice';

// Utils
import {
  formatCurrency,
  formatDate,
  formatTicketNumber,
  formatAgentCode,
} from '../utils/formatters';

const Transactions = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { transactions, filters, ui, pagination } = useAppSelector(
    (state) => state.transactions
  );

  const { loading, data, error } = transactions;

  // Load transactions on component mount and filter changes
  React.useEffect(() => {
    dispatch(fetchTransactions(filters));
  }, [dispatch, filters]);

  const handleRefresh = () => {
    dispatch(fetchTransactions(filters));
    dispatch(
      addNotification({
        type: 'info',
        message: 'Transactions refreshed',
        autoHideDuration: 2000,
      })
    );
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
      case 0: // All
        dispatch(setFilter({ key: 'transactionCode', value: '' }));
        break;
      case 1: // Recent (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const startDate = sevenDaysAgo
          .toISOString()
          .slice(2, 10)
          .replace(/-/g, '');
        dispatch(setFilter({ key: 'startDate', value: startDate }));
        break;
      case 2: // Refunds
        dispatch(setFilter({ key: 'transactionCode', value: 'RFND' }));
        break;
      default:
        break;
    }
  };

  const handleExport = () => {
    // Implement export functionality
    dispatch(
      addNotification({
        type: 'info',
        message: 'Export functionality coming soon',
      })
    );
  };

  const handleRowSelection = (index) => {
    dispatch(toggleTransactionSelection(data[index]?.TRNN));
  };

  const handleSelectAll = (selectedIndices) => {
    if (selectedIndices.length === 0) {
      dispatch(clearTransactionSelection());
    } else {
      dispatch(selectAllTransactions());
    }
  };

  // Table columns configuration
  const columns = [
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
      id: 'TDNR',
      label: 'Ticket Number',
      minWidth: 160,
      render: (value) => (
        <Typography variant="body2" fontFamily="monospace">
          {formatTicketNumber(value)}
        </Typography>
      ),
    },
    {
      id: 'DAIS',
      label: 'Issue Date',
      minWidth: 100,
      render: (value) => formatDate(value),
    },
    {
      id: 'AGTN',
      label: 'Agent Code',
      minWidth: 100,
      render: (value) => (
        <Chip
          label={formatAgentCode(value)}
          size="small"
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
        />
      ),
    },
    {
      id: 'passenger',
      label: 'Passenger',
      minWidth: 180,
      render: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.passenger?.PXNM || 'N/A'}
          </Typography>
          {row.passenger?.PXTP && (
            <Typography variant="caption" color="text.secondary">
              {row.passenger.PXTP}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'financial',
      label: 'Amount',
      minWidth: 120,
      align: 'right',
      render: (value, row) => (
        <Box textAlign="right">
          <Typography variant="body2" fontWeight={500}>
            {formatCurrency(row.financial?.TDAM)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.financial?.CUTP}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'itinerary',
      label: 'Route',
      minWidth: 150,
      render: (value, row) => {
        const segments = row.itinerary || [];
        if (segments.length === 0) return 'N/A';

        const firstSegment = segments[0];
        const lastSegment = segments[segments.length - 1];

        return (
          <Box>
            <Typography variant="body2">
              {firstSegment.ORAC} → {lastSegment.DSTC}
            </Typography>
            {segments.length > 1 && (
              <Typography variant="caption" color="text.secondary">
                {segments.length} segments
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      id: 'TRNC',
      label: 'Type',
      minWidth: 80,
      render: (value) => (
        <Chip
          label={value || 'STD'}
          size="small"
          color={value === 'RFND' ? 'error' : 'default'}
        />
      ),
    },
  ];

  const tabLabels = ['All Transactions', 'Recent', 'Refunds'];

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
          Transactions
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Toggle Filters">
            <IconButton
              onClick={() => dispatch(toggleFilters())}
              color={ui.showFilters ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={`Switch to ${
              ui.viewMode === 'table' ? 'Card' : 'Table'
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

          <Tooltip title="Export">
            <IconButton
              onClick={handleExport}
              disabled={loading || data.length === 0}
            >
              <ExportIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={ui.selectedTab}
          onChange={handleTabChange}
          aria-label="transaction tabs"
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={index}
              label={label}
              id={`transaction-tab-${index}`}
              aria-controls={`transaction-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Filters */}
      {ui.showFilters && (
        <Box sx={{ mb: 3 }}>
          <TransactionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
          />
        </Box>
      )}

      {/* Summary */}
      {pagination && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            label={`${pagination.totalRecords} transactions`}
            color="primary"
            variant="outlined"
          />
          {ui.selectedTransactions.length > 0 && (
            <Chip
              label={`${ui.selectedTransactions.length} selected`}
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Data Table */}
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        selectable={true}
        selectedRows={ui.selectedTransactions
          .map((trnn) => data.findIndex((row) => row.TRNN === trnn))
          .filter((index) => index !== -1)}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        onSelectRow={handleRowSelection}
        onSelectAll={handleSelectAll}
        onRefresh={handleRefresh}
        onExport={handleExport}
        emptyMessage="No transactions found"
      />
    </Box>
  );
};

export default Transactions;
