import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  CircularProgress,
  Typography,
  Chip,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  pagination = null,
  sortable = true,
  selectable = false,
  expandable = false,
  selectedRows = [],
  expandedRows = [],
  onSort,
  onPageChange,
  onRowsPerPageChange,
  onSelectAll,
  onSelectRow,
  onExpandRow,
  onRefresh,
  onExport,
  onRowClick, // New prop for row click handling
  rowAction, // New prop for row actions
  renderExpandedRow,
  emptyMessage = 'No data available',
  stickyHeader = true,
  maxHeight = '600px',
  size = 'medium',
}) => {
  const theme = useTheme();

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row, index) => index);
      onSelectAll?.(newSelected);
    } else {
      onSelectAll?.([]);
    }
  };

  const handleSelectClick = (event, index) => {
    event.stopPropagation(); // Prevent row click
    onSelectRow?.(index);
  };

  const handleExpandClick = (event, index) => {
    event.stopPropagation(); // Prevent row click
    onExpandRow?.(index);
  };

  const handleRowClick = (row, index) => {
    // Only trigger if not in selection mode or if onRowClick is explicitly provided
    if (onRowClick) {
      onRowClick(row, index);
    } else if (rowAction && typeof rowAction === 'function') {
      const action = rowAction(row, index);
      if (action && action.onClick) {
        action.onClick();
      }
    }
  };

  const handleActionClick = (event, row, index) => {
    event.stopPropagation(); // Prevent row click
    if (rowAction && typeof rowAction === 'function') {
      const action = rowAction(row, index);
      if (action && action.onClick) {
        action.onClick();
      }
    }
  };

  const handleSortClick = (columnId) => {
    if (!sortable || !onSort) return;
    onSort(columnId);
  };

  const isSelected = (index) => selectedRows.includes(index);
  const isExpanded = (index) => expandedRows.includes(index);

  // Determine if we should show action column
  const hasActions = rowAction && typeof rowAction === 'function';

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Error loading data: {error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Table Actions */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          {selectable && selectedRows.length > 0 && (
            <Chip
              label={`${selectedRows.length} selected`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          {onExport && (
            <Tooltip title="Export">
              <IconButton
                onClick={onExport}
                disabled={loading || data.length === 0}
              >
                <ExportIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight }}>
        <Table
          stickyHeader={stickyHeader}
          size={size}
          sx={{
            '& .MuiTableCell-head': {
              backgroundColor: theme.palette.grey[50],
              fontWeight: 600,
            },
          }}
        >
          <TableHead>
            <TableRow>
              {/* Selection column */}
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < data.length
                    }
                    checked={
                      data.length > 0 && selectedRows.length === data.length
                    }
                    onChange={handleSelectAllClick}
                    disabled={loading}
                  />
                </TableCell>
              )}

              {/* Expand column */}
              {expandable && <TableCell padding="none" sx={{ width: 48 }} />}

              {/* Data columns */}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={column.sortDirection || false}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={column.sortDirection !== false}
                      direction={column.sortDirection || 'asc'}
                      onClick={() => handleSortClick(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {/* Actions column */}
              {hasActions && (
                <TableCell align="center" sx={{ width: 120 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (expandable ? 1 : 0) +
                    (hasActions ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 8 }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (expandable ? 1 : 0) +
                    (hasActions ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const isItemSelected = isSelected(index);
                const isItemExpanded = isExpanded(index);
                const labelId = `table-checkbox-${index}`;

                // Get action for this row
                const action = hasActions ? rowAction(row, index) : null;

                return (
                  <React.Fragment key={index}>
                    <TableRow
                      hover
                      role={selectable ? 'checkbox' : undefined}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      onClick={() => !selectable && handleRowClick(row, index)}
                      sx={{
                        cursor:
                          !selectable && (onRowClick || hasActions)
                            ? 'pointer'
                            : 'default',
                        '&.Mui-selected': {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.08
                          ),
                        },
                        '&:hover': {
                          backgroundColor:
                            !selectable && (onRowClick || hasActions)
                              ? alpha(theme.palette.primary.main, 0.04)
                              : undefined,
                        },
                      }}
                    >
                      {/* Selection checkbox */}
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(event) =>
                              handleSelectClick(event, index)
                            }
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                      )}

                      {/* Expand button */}
                      {expandable && (
                        <TableCell padding="none">
                          <IconButton
                            size="small"
                            onClick={(event) => handleExpandClick(event, index)}
                          >
                            {isItemExpanded ? (
                              <KeyboardArrowDown />
                            ) : (
                              <KeyboardArrowRight />
                            )}
                          </IconButton>
                        </TableCell>
                      )}

                      {/* Data cells */}
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.render
                              ? column.render(value, row, index)
                              : value}
                          </TableCell>
                        );
                      })}

                      {/* Actions cell */}
                      {hasActions && action && (
                        <TableCell align="center">
                          <Tooltip title={action.label || 'Action'}>
                            <IconButton
                              size="small"
                              onClick={(event) =>
                                handleActionClick(event, row, index)
                              }
                              color="primary"
                            >
                              {action.icon || <ViewIcon />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>

                    {/* Expanded row content */}
                    {expandable && isItemExpanded && renderExpandedRow && (
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={
                            columns.length +
                            (selectable ? 1 : 0) +
                            (expandable ? 1 : 0) +
                            (hasActions ? 1 : 0)
                          }
                        >
                          <Box sx={{ margin: 1 }}>
                            {renderExpandedRow(row, index)}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={pagination.totalRecords}
          rowsPerPage={pagination.limit}
          page={pagination.currentPage - 1} // MUI uses 0-based indexing
          onPageChange={(event, newPage) => onPageChange?.(newPage + 1)}
          onRowsPerPageChange={(event) => {
            const newRowsPerPage = parseInt(event.target.value, 10);
            onRowsPerPageChange?.(newRowsPerPage);
          }}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default DataTable;
