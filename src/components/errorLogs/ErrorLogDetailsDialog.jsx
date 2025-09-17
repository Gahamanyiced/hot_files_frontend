// src/components/errorLogs/ErrorLogDetailsDialog.jsx - Traditional Redux version
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Code as CodeIcon,
  BugReport as BugIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

// Traditional Redux actions and selectors
import {
  fetchErrorLogDetails,
  setDetailsDialogOpen,
  selectErrorLogDetails,
  selectErrorLogsUI,
} from '../../store/slices/errorLogSlice';

// Utils
import {
  formatDate,
  formatDuration,
  formatFileSize,
  formatNumber,
  formatRecordType,
} from '../../utils/formatters';

const ErrorLogDetailsDialog = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const {
    data: logDetails,
    loading,
    error,
  } = useSelector(selectErrorLogDetails);
  const { detailsDialogOpen, selectedUploadId } =
    useSelector(selectErrorLogsUI);

  // Load details when dialog opens
  React.useEffect(() => {
    if (
      detailsDialogOpen &&
      selectedUploadId &&
      (!logDetails || logDetails.uploadId !== selectedUploadId)
    ) {
      dispatch(fetchErrorLogDetails(selectedUploadId));
    }
  }, [dispatch, detailsDialogOpen, selectedUploadId, logDetails]);

  const handleClose = () => {
    dispatch(setDetailsDialogOpen({ open: false }));
  };

  const handleDownloadErrorReport = () => {
    if (!logDetails) return;

    const errorReport = {
      uploadId: logDetails.uploadId,
      fileName: logDetails.fileName,
      uploadedAt: logDetails.uploadedAt,
      status: logDetails.status,
      summary: {
        totalProcessed: logDetails.totalProcessed,
        totalSaved: logDetails.totalSaved,
        totalErrors: logDetails.totalErrors,
        processingTime: logDetails.processingTime,
      },
      errorsByType: logDetails.errorsByType,
      metadata: {
        fileSize: logDetails.fileSize,
        userAgent: logDetails.userAgent,
        ipAddress: logDetails.ipAddress,
      },
    };

    const blob = new Blob([JSON.stringify(errorReport, null, 2)], {
      type: 'application/json',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-report-${selectedUploadId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const renderErrorDetails = (errorsByType) => {
    if (!errorsByType) return null;

    return Object.entries(errorsByType).map(([recordType, errors]) => (
      <Accordion key={recordType} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">{formatRecordType(recordType)}</Typography>
            <Chip
              icon={<ErrorIcon />}
              label={`${errors.totalErrors} errors`}
              color="error"
              size="small"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 3 }}>
            {/* Validation Errors */}
            {errors.validationErrors?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <WarningIcon color="warning" />
                  Validation Errors ({errors.validationErrors.length})
                </Typography>

                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Line #</TableCell>
                        <TableCell>Error Message</TableCell>
                        <TableCell>Record Content</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {errors.validationErrors.map((error, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip
                              label={error.lineNumber}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ fontWeight: 'medium' }}
                            >
                              {error.error}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                bgcolor: theme.palette.grey[100],
                                p: 1,
                                borderRadius: 1,
                                maxWidth: 300,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {error.line}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {error.validationDetails && (
                              <Tooltip
                                title={JSON.stringify(
                                  error.validationDetails,
                                  null,
                                  2
                                )}
                              >
                                <IconButton size="small">
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Save Errors */}
            {errors.saveErrors?.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <BugIcon color="error" />
                  Save Errors ({errors.saveErrors.length})
                </Typography>

                <List dense>
                  {errors.saveErrors.map((saveError, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="error">
                            {saveError}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <Dialog
      open={detailsDialogOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Error Log Details</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Download Error Report">
            <IconButton
              onClick={handleDownloadErrorReport}
              disabled={!logDetails}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load error log details: {error.message || error}
          </Alert>
        )}

        {logDetails && (
          <Box>
            {/* Overview Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <TimelineIcon />
                  Upload Overview
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Upload ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                      >
                        {logDetails.uploadId}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        File Name
                      </Typography>
                      <Typography variant="body2">
                        {logDetails.fileName}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        File Size
                      </Typography>
                      <Typography variant="body2">
                        {formatFileSize(logDetails.fileSize)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded At
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(logDetails.uploadedAt)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={logDetails.status}
                          color={
                            logDetails.status === 'completed'
                              ? 'success'
                              : logDetails.status === 'failed'
                              ? 'error'
                              : 'warning'
                          }
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Processing Time
                      </Typography>
                      <Typography variant="body2">
                        {formatDuration(logDetails.processingTime)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        User Agent
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {logDetails.userAgent || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        IP Address
                      </Typography>
                      <Typography variant="body2">
                        {logDetails.ipAddress || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Processing Summary */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Processing Summary
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary">
                        {formatNumber(logDetails.totalProcessed)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Processed
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="success.main">
                        {formatNumber(logDetails.totalSaved)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Successfully Saved
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="error.main">
                        {formatNumber(logDetails.totalErrors)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Errors
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="info.main">
                        {logDetails.totalProcessed > 0
                          ? (
                              (logDetails.totalSaved /
                                logDetails.totalProcessed) *
                              100
                            ).toFixed(1)
                          : '0.0'}
                        %
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Success Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Error Details by Type */}
            {logDetails.errorsByType &&
              Object.keys(logDetails.errorsByType).length > 0 && (
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <CodeIcon />
                      Error Details by Record Type
                    </Typography>

                    {renderErrorDetails(logDetails.errorsByType)}
                  </CardContent>
                </Card>
              )}

            {/* No Errors Message */}
            {(!logDetails.errorsByType ||
              Object.keys(logDetails.errorsByType).length === 0) &&
              logDetails.totalErrors === 0 && (
                <Card>
                  <CardContent>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography
                        variant="h6"
                        color="success.main"
                        gutterBottom
                      >
                        No Errors Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This file was processed successfully without any
                        validation or save errors.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorLogDetailsDialog;
