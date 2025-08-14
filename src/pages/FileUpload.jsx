import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Description as FileIcon,
  Timeline as StatsIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  uploadHot22File,
  setCurrentFile,
  clearUploadResult,
  fetchFileStats,
  deleteAllRecords,
  checkHealth,
} from '../store/slices/fileSlice';
import { addNotification } from '../store/slices/uiSlice';

// Utils
import { formatFileSize, formatDuration, formatNumber, formatDate } from '../utils/formatters';

const FileUpload = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  const {
    upload,
    stats,
    ui,
    health,
    processing,
  } = useAppSelector((state) => state.files);

  const {
    loading,
    progress,
    error,
    result,
    currentFile,
  } = upload;

  const fileInputRef = React.useRef(null);
  const [showDetails, setShowDetails] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  // Load file stats and health on component mount
  React.useEffect(() => {
    dispatch(fetchFileStats());
    dispatch(checkHealth());
  }, [dispatch]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.txt')) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please select a valid HOT22 text file (.txt)',
      }));
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      dispatch(addNotification({
        type: 'error',
        message: 'File size exceeds 100MB limit',
      }));
      return;
    }

    dispatch(setCurrentFile(file));
    dispatch(clearUploadResult());
  };

  const handleUpload = () => {
    if (!currentFile) return;

    const onProgress = (progressValue) => {
      // Progress is handled by Redux, but we can add additional logic here
    };

    dispatch(uploadHot22File({ file: currentFile, onProgress }))
      .unwrap()
      .then((response) => {
        dispatch(addNotification({
          type: 'success',
          message: `File uploaded successfully! Processed ${response.results?.summary?.totalSaved || 0} records.`,
        }));
        // Refresh stats after successful upload
        dispatch(fetchFileStats());
        dispatch(checkHealth());
      })
      .catch((error) => {
        dispatch(addNotification({
          type: 'error',
          message: `Upload failed: ${error.message || 'Unknown error'}`,
        }));
      });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const resetUpload = () => {
    dispatch(setCurrentFile(null));
    dispatch(clearUploadResult());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteAllRecords = () => {
    dispatch(deleteAllRecords())
      .unwrap()
      .then(() => {
        dispatch(addNotification({
          type: 'success',
          message: 'All records deleted successfully',
        }));
        dispatch(fetchFileStats());
        setShowDeleteDialog(false);
      })
      .catch((error) => {
        dispatch(addNotification({
          type: 'error',
          message: `Delete failed: ${error.message}`,
        }));
      });
  };

  const handleRefreshStats = () => {
    dispatch(fetchFileStats());
    dispatch(checkHealth());
    dispatch(addNotification({
      type: 'info',
      message: 'Statistics refreshed',
      autoHideDuration: 2000,
    }));
  };

  const getProcessingSteps = () => {
    if (!result?.results) return [];
    
    const steps = [
      {
        label: 'File Upload',
        description: `Uploaded ${currentFile?.name} (${formatFileSize(currentFile?.size || 0)})`,
        completed: true,
      },
      {
        label: 'File Parsing',
        description: `Parsed ${formatNumber(result.results.summary.totalProcessed)} lines`,
        completed: true,
      },
      {
        label: 'Data Validation',
        description: `Validated ${formatNumber(result.results.summary.totalProcessed)} records`,
        completed: true,
      },
      {
        label: 'Database Storage',
        description: `Saved ${formatNumber(result.results.summary.totalSaved)} records`,
        completed: true,
      },
    ];

    return steps;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          File Upload & Management
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Statistics">
            <IconButton onClick={handleRefreshStats} disabled={stats.loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            color="error"
            onClick={() => setShowDeleteDialog(true)}
            disabled={!stats.data?.totalRecords || processing.isProcessing}
            startIcon={<DeleteIcon />}
          >
            Clear Database
          </Button>
        </Box>
      </Box>

      {/* Health Status */}
      {health.data && (
        <Alert 
          severity={health.data.status === 'healthy' ? 'success' : 'warning'} 
          sx={{ mb: 3 }}
          icon={health.data.status === 'healthy' ? <CheckCircleIcon /> : <WarningIcon />}
        >
          <Typography variant="body2">
            Database Status: <strong>{health.data.status}</strong> | 
            Uptime: {formatDuration(health.data.uptime * 1000)} | 
            Last Check: {formatDate(health.lastChecked)}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Upload HOT22 File
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select a HOT22 text file to upload and process. The system will parse and store all transaction records
                including BKS, BAR, BKI, and other record types.
              </Typography>

              {/* Drop Zone */}
              <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                sx={{
                  border: `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: dragActive ? theme.palette.action.hover : 'transparent',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: dragActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    mb: 2,
                  }} 
                />
                
                <Typography variant="h6" gutterBottom>
                  {currentFile ? 'File Selected' : 'Drop HOT22 file here or click to browse'}
                </Typography>
                
                {currentFile ? (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      icon={<FileIcon />}
                      label={`${currentFile.name} (${formatFileSize(currentFile.size)})`}
                      color="primary"
                      variant="outlined"
                      onDelete={resetUpload}
                    />
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Supported format: .txt (HOT22 format) • Max size: 100MB
                  </Typography>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </Box>

              {/* Upload Progress */}
              {loading && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      Processing file...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {progress}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Please wait while we parse and validate your HOT22 file...
                  </Typography>
                </Box>
              )}

              {/* Processing Status */}
              {processing.isProcessing && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    {processing.currentStep} 
                    {processing.totalRecords > 0 && (
                      <> • {processing.processedRecords}/{processing.totalRecords} records</>
                    )}
                  </Typography>
                </Alert>
              )}

              {/* Upload Actions */}
              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!currentFile || loading || processing.isProcessing}
                  startIcon={<CloudUploadIcon />}
                  size="large"
                >
                  {loading ? 'Processing...' : 'Upload & Process'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={resetUpload}
                  disabled={loading || processing.isProcessing}
                >
                  Clear Selection
                </Button>

                {result && (
                  <Button
                    variant="outlined"
                    onClick={() => setShowDetails(true)}
                    startIcon={<ViewIcon />}
                  >
                    View Details
                  </Button>
                )}
              </Box>

              {/* Upload Result */}
              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Upload Failed</strong>
                  </Typography>
                  <Typography variant="body2">
                    {typeof error === 'string' ? error : error.message || 'Unknown error occurred'}
                  </Typography>
                </Alert>
              )}

              {result && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Upload Completed Successfully!</strong>
                  </Typography>
                  <Typography variant="body2">
                    Processed {formatNumber(result.results?.summary?.totalProcessed || 0)} lines, 
                    saved {formatNumber(result.results?.summary?.totalSaved || 0)} records 
                    in {formatDuration(result.results?.summary?.processingTime || 0)}
                  </Typography>
                  {result.results?.summary?.totalErrors > 0 && (
                    <Typography variant="body2" color="warning.main">
                      {formatNumber(result.results.summary.totalErrors)} records had validation errors
                    </Typography>
                  )}
                </Alert>
              )}

              {/* Processing Summary */}
              {result?.results && (
                <Card variant="outlined" sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Processing Summary
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Total Lines
                        </Typography>
                        <Typography variant="h6">
                          {formatNumber(result.results.summary.totalProcessed)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Saved Records
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {formatNumber(result.results.summary.totalSaved)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Validation Errors
                        </Typography>
                        <Typography variant="h6" color="error.main">
                          {formatNumber(result.results.summary.totalErrors)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Processing Time
                        </Typography>
                        <Typography variant="h6">
                          {formatDuration(result.results.summary.processingTime)}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Record Types Breakdown */}
                    {result.results.summary.recordTypes && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Record Types Processed
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {Object.entries(result.results.summary.recordTypes).map(([type, counts]) => (
                            <Chip
                              key={type}
                              label={`${type}: ${formatNumber(counts.saved)}/${formatNumber(counts.processed)}`}
                              size="small"
                              variant="outlined"
                              color={counts.errors > 0 ? 'warning' : 'success'}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Database Statistics */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StatsIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Database Statistics
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleRefreshStats} disabled={stats.loading}>
                      <RefreshIcon />
                    </IconButton>
                  </Box>

                  {stats.loading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Loading statistics...
                      </Typography>
                    </Box>
                  ) : stats.error ? (
                    <Alert severity="error" size="small">
                      Error loading statistics: {stats.error}
                    </Alert>
                  ) : stats.data ? (
                    <Box>
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                          {formatNumber(stats.data.totalRecords)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Records in Database
                        </Typography>
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Collections
                          </Typography>
                          <Typography variant="h6">
                            {stats.data.collections || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Last Updated
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(stats.lastUpdated)}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2" gutterBottom>
                        Record Types
                      </Typography>
                      
                      <List dense>
                        {Object.entries(stats.data.statistics || {})
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 8)
                          .map(([type, count]) => (
                          <ListItem key={type} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <FileIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" fontFamily="monospace">
                                    {type}
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatNumber(count)}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No statistics available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Upload History */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Upload History
                  </Typography>
                  
                  {ui.uploadHistory.length > 0 ? (
                    <List dense>
                      {ui.uploadHistory.slice(0, 10).map((upload) => (
                        <ListItem key={upload.id} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {upload.status === 'success' ? (
                              <CheckCircleIcon fontSize="small" color="success" />
                            ) : (
                              <ErrorIcon fontSize="small" color="error" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" noWrap>
                                {upload.filename}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  {formatNumber(upload.recordCount)} records • {formatDate(upload.timestamp)}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No upload history available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Processing Details Dialog */}
      <Dialog 
        open={showDetails} 
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Processing Details
        </DialogTitle>
        <DialogContent>
          {result?.results && (
            <Box>
              {/* Processing Steps */}
              <Stepper orientation="vertical" sx={{ mb: 3 }}>
                {getProcessingSteps().map((step, index) => (
                  <Step key={index} active={true} completed={step.completed}>
                    <StepLabel>
                      <Typography variant="subtitle2">{step.label}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {/* Detailed Record Types */}
              {result.results.summary.recordTypes && (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Record Type</TableCell>
                        <TableCell align="right">Processed</TableCell>
                        <TableCell align="right">Saved</TableCell>
                        <TableCell align="right">Errors</TableCell>
                        <TableCell align="right">Success Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(result.results.summary.recordTypes).map(([type, counts]) => {
                        const successRate = ((counts.saved / counts.processed) * 100).toFixed(1);
                        return (
                          <TableRow key={type}>
                            <TableCell sx={{ fontFamily: 'monospace' }}>{type}</TableCell>
                            <TableCell align="right">{formatNumber(counts.processed)}</TableCell>
                            <TableCell align="right">{formatNumber(counts.saved)}</TableCell>
                            <TableCell align="right">{formatNumber(counts.errors)}</TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={`${successRate}%`}
                                size="small"
                                color={parseFloat(successRate) >= 95 ? 'success' : parseFloat(successRate) >= 80 ? 'warning' : 'error'}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirm Database Clear</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              This will permanently delete all {formatNumber(stats.data?.totalRecords || 0)} records 
              from the database. This action cannot be undone.
            </Typography>
          </Alert>
          <Typography variant="body2">
            Are you sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteAllRecords} 
            color="error" 
            variant="contained"
            disabled={processing.isProcessing}
          >
            {processing.isProcessing ? 'Deleting...' : 'Delete All Records'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUpload;