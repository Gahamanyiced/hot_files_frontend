import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Button,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Code as CodeIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { addNotification } from '../../store/slices/uiSlice';

// API
import { errorLogsApi } from '../../services/errorLogsApi';

const ErrorsByTypeSection = ({ initialData }) => {
  const { uploadId } = useParams();
  const dispatch = useAppDispatch();

  // State for current error data
  const [errorData, setErrorData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Separate pagination states for different error types
  const [validationPagination, setValidationPagination] = useState({
    page: 1,
    limit: 20,
  });

  const [savePagination, setSavePagination] = useState({
    page: 1,
    limit: 20,
  });

  // Filter states
  const [filters, setFilters] = useState({
    recordType: null,
    errorType: null,
  });

  const [expandedAccordion, setExpandedAccordion] = useState(null);

  // Track pagination per record type
  const [recordTypePagination, setRecordTypePagination] = useState({});

  // Fetch error data based on current filters and pagination
  const fetchErrorData = useCallback(
    async (newFilters = {}, errorType = null, pagination = null) => {
      if (!uploadId) return;

      setLoading(true);
      setError(null);

      try {
        const params = {};

        // Add recordType filter if specified
        if (newFilters.recordType) {
          params.recordType = newFilters.recordType;
        }

        // Add errorType filter if specified
        if (newFilters.errorType || errorType) {
          params.errorType = newFilters.errorType || errorType;
        }

        // Add pagination parameters
        if (pagination) {
          params.page = pagination.page;
          params.limit = pagination.limit;
        } else {
          // Use current pagination state
          params.page = validationPagination.page;
          params.limit = validationPagination.limit;
        }

        console.log('API Call params:', params); // Debug log to see what's being sent

        const response = await errorLogsApi.getErrorLogDetails(
          uploadId,
          params
        );
        setErrorData(response.data.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch error data');
        dispatch(
          addNotification({
            type: 'error',
            message: 'Failed to load error details',
            autoHideDuration: 4000,
          })
        );
      } finally {
        setLoading(false);
      }
    },
    [uploadId, dispatch, validationPagination]
  );

  // Update data when filters change
  useEffect(() => {
    if (filters.recordType || filters.errorType) {
      fetchErrorData(filters);
    }
  }, [filters, fetchErrorData]);

  // Handle filter changes with pagination reset
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Reset all pagination when global filters change
    setValidationPagination({ page: 1, limit: 20 });
    setSavePagination({ page: 1, limit: 20 });
    setRecordTypePagination({}); // Clear all record type pagination
    setExpandedAccordion(null); // Close any open accordion
  };

  // Handle validation errors pagination with record type tracking
  const handleValidationPageChange = (
    page,
    limit = validationPagination.limit
  ) => {
    const newPagination = { page, limit };
    setValidationPagination(newPagination);

    // Save pagination state for current record type
    if (expandedAccordion) {
      setRecordTypePagination((prev) => ({
        ...prev,
        [expandedAccordion]: {
          ...prev[expandedAccordion],
          validation: newPagination,
        },
      }));

      // Fetch data with recordType filter (accordion is open)
      fetchErrorData(
        { recordType: expandedAccordion },
        'validation',
        newPagination
      );
    } else {
      // Fetch general data (no accordion open)
      fetchErrorData({}, 'validation', newPagination);
    }
  };

  // Handle save errors pagination with record type tracking
  const handleSavePageChange = (page, limit = savePagination.limit) => {
    const newPagination = { page, limit };
    setSavePagination(newPagination);

    // Save pagination state for current record type
    if (expandedAccordion) {
      setRecordTypePagination((prev) => ({
        ...prev,
        [expandedAccordion]: {
          ...prev[expandedAccordion],
          save: newPagination,
        },
      }));

      // Fetch data with recordType filter (accordion is open)
      fetchErrorData({ recordType: expandedAccordion }, 'save', newPagination);
    } else {
      // Fetch general data (no accordion open)
      fetchErrorData({}, 'save', newPagination);
    }
  };

  // Handle accordion expansion with proper API calls
  const handleAccordionChange = (recordType) => (event, isExpanded) => {
    const newExpandedAccordion = isExpanded ? recordType : null;
    setExpandedAccordion(newExpandedAccordion);

    if (isExpanded) {
      // Opening accordion - fetch record-type-specific data
      // Initialize pagination for this record type if it doesn't exist
      if (!recordTypePagination[recordType]) {
        setRecordTypePagination((prev) => ({
          ...prev,
          [recordType]: {
            validation: { page: 1, limit: 20 },
            save: { page: 1, limit: 20 },
          },
        }));
      }

      // Set pagination states for this record type
      setValidationPagination(
        recordTypePagination[recordType]?.validation || { page: 1, limit: 20 }
      );
      setSavePagination(
        recordTypePagination[recordType]?.save || { page: 1, limit: 20 }
      );

      // Fetch record-type-specific data
      // API call: /api/error-logs/{uploadId}?page=1&limit=20&recordType=BKS24
      fetchErrorData({ recordType }, null, null);
    } else {
      // Closing accordion - fetch general overview data with default pagination
      // Always reset to page 1, limit 20 for overview
      setValidationPagination({ page: 1, limit: 20 });
      setSavePagination({ page: 1, limit: 20 });

      // Fetch general overview data with explicit default pagination
      // API call: /api/error-logs/{uploadId}?page=1&limit=20
      fetchErrorData({}, null, { page: 1, limit: 20 });
    }
  };

  // Export errors
  const exportErrors = async (recordType, errorType = 'all') => {
    try {
      const response = await errorLogsApi.exportErrors(uploadId, {
        recordType,
        errorType,
        format: 'csv',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `errors-${recordType}-${errorType}-${
        new Date().toISOString().split('T')[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      dispatch(
        addNotification({
          type: 'success',
          message: 'Error report exported successfully',
          autoHideDuration: 3000,
        })
      );
    } catch (err) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Failed to export error report',
          autoHideDuration: 4000,
        })
      );
    }
  };

  if (
    !errorData?.errorsByType ||
    Object.keys(errorData.errorsByType).length === 0
  ) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Error Details
          </Typography>
          <Alert severity="info">No errors found for this upload.</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Errors by Record Type</Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Record Type Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Record Type</InputLabel>
              <Select
                value={filters.recordType || ''}
                onChange={(e) =>
                  handleFilterChange('recordType', e.target.value || null)
                }
                label="Record Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.keys(errorData.errorsByType).map((recordType) => (
                  <MenuItem key={recordType} value={recordType}>
                    {recordType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Refresh Button */}
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => fetchErrorData()}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Applied Filters Display */}
        {(filters.recordType || filters.errorType) && (
          <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Filters:
            </Typography>
            {filters.recordType && (
              <Chip
                label={`Type: ${filters.recordType}`}
                size="small"
                onDelete={() => handleFilterChange('recordType', null)}
              />
            )}
            {filters.errorType && (
              <Chip
                label={`Errors: ${filters.errorType}`}
                size="small"
                onDelete={() => handleFilterChange('errorType', null)}
              />
            )}
          </Box>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {Object.entries(errorData.errorsByType).map(
              ([recordType, errorTypeData]) => (
                <Accordion
                  key={recordType}
                  expanded={expandedAccordion === recordType}
                  onChange={handleAccordionChange(recordType)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      <Typography variant="h6">{recordType}</Typography>
                      <Chip
                        label={`${errorTypeData.totalErrors} errors`}
                        color="error"
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    {/* Validation Errors with independent pagination */}
                    {errorTypeData.validationErrors &&
                      errorTypeData.validationErrors.length > 0 && (
                        <ValidationErrorsTable
                          errors={errorTypeData.validationErrors}
                          pagination={
                            errorTypeData.pagination?.validationErrors
                          }
                          recordType={recordType}
                          currentPagination={validationPagination}
                          onPageChange={handleValidationPageChange}
                          onExport={() =>
                            exportErrors(recordType, 'validation')
                          }
                          totalValidationErrors={errorTypeData.totalErrors} // Pass actual total
                        />
                      )}

                    {/* Save Errors with independent pagination */}
                    {errorTypeData.saveErrors &&
                      errorTypeData.saveErrors.length > 0 && (
                        <SaveErrorsList
                          errors={errorTypeData.saveErrors}
                          pagination={errorTypeData.pagination?.saveErrors}
                          recordType={recordType}
                          currentPagination={savePagination}
                          onPageChange={handleSavePageChange}
                          onExport={() => exportErrors(recordType, 'save')}
                          totalSaveErrors={errorTypeData.saveErrors?.length} // Use current array length or total if available
                        />
                      )}
                  </AccordionDetails>
                </Accordion>
              )
            )}

            {/* Remove global pagination since each error type has its own */}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Validation Errors Table Component with independent pagination
const ValidationErrorsTable = ({
  errors,
  pagination,
  recordType,
  currentPagination,
  onPageChange,
  onExport,
  totalValidationErrors, // Add this prop to get the actual total
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <WarningIcon color="warning" />
          Validation Errors ({totalValidationErrors} total)
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onExport}
        >
          Export CSV
        </Button>
      </Box>

      {/* Error Stats - use actual total validation errors */}
      {totalValidationErrors && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Showing
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {(currentPagination.page - 1) * currentPagination.limit + 1}-
              {Math.min(
                currentPagination.page * currentPagination.limit,
                totalValidationErrors
              )}{' '}
              of {totalValidationErrors}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total Pages
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {Math.ceil(totalValidationErrors / currentPagination.limit)}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Errors Table with server-side pagination - no max height restrictions */}
      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 80 }}>Line #</TableCell>
              <TableCell sx={{ minWidth: 200 }}>Error</TableCell>
              <TableCell sx={{ minWidth: 300 }}>Record Content</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Display ALL errors from server response - no client-side limiting */}
            {errors.map((error, index) => (
              <TableRow
                key={`${error.lineNumber}-${index}`}
                hover
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {error.lineNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="error">
                    {error.error}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    sx={{
                      wordBreak: 'break-all',
                      fontSize: '0.75rem',
                      maxWidth: 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      '&:hover': {
                        whiteSpace: 'normal',
                        wordBreak: 'break-all',
                      },
                    }}
                    title={error.line}
                  >
                    {error.line}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    color="primary"
                    sx={{
                      bgcolor: 'primary.50',
                      px: 1,
                      py: 0.5,
                      borderRadius: 0.5,
                      display: 'inline-block',
                    }}
                  >
                    {error.validationDetails?.[0]?.context?.value || 'N/A'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination with actual total count */}
      {totalValidationErrors && (
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]} // Increased options, no 100 limit
          component="div"
          count={totalValidationErrors} // Use actual total validation errors
          rowsPerPage={currentPagination.limit}
          page={currentPagination.page - 1}
          onPageChange={(event, newPage) =>
            onPageChange(newPage + 1, currentPagination.limit)
          }
          onRowsPerPageChange={(event) => {
            const newLimit = parseInt(event.target.value, 10);
            onPageChange(1, newLimit); // Reset to page 1 when changing page size
          }}
          labelRowsPerPage="Validation errors per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${
              count !== -1 ? count : `more than ${to}`
            } validation errors`
          }
        />
      )}
    </Box>
  );
};

// Save Errors List Component with independent pagination
const SaveErrorsList = ({
  errors,
  pagination,
  recordType,
  currentPagination,
  onPageChange,
  onExport,
  totalSaveErrors, // Add this prop for actual total
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ErrorIcon color="error" />
          Save Errors ({totalSaveErrors || errors.length} total)
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onExport}
        >
          Export CSV
        </Button>
      </Box>

      <List dense>
        {/* Display ALL save errors from server response - no client-side limiting */}
        {errors.map((error, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText
              primary={error}
              primaryTypographyProps={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Pagination for Save Errors with actual total count */}
      {totalSaveErrors && totalSaveErrors > currentPagination.limit && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]} // Increased options, no artificial limit
          component="div"
          count={totalSaveErrors} // Use actual total save errors
          rowsPerPage={currentPagination.limit}
          page={currentPagination.page - 1}
          onPageChange={(event, newPage) =>
            onPageChange(newPage + 1, currentPagination.limit)
          }
          onRowsPerPageChange={(event) => {
            const newLimit = parseInt(event.target.value, 10);
            onPageChange(1, newLimit); // Reset to page 1 when changing page size
          }}
          labelRowsPerPage="Save errors per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${
              count !== -1 ? count : `more than ${to}`
            } save errors`
          }
        />
      )}
    </Box>
  );
};

export default ErrorsByTypeSection;
