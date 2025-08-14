import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Skeleton,
  Button,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Description as FileIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as ProcessingIcon,
  CloudUpload as UploadIcon,
  Visibility as ViewIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { fetchFileStats } from '../../store/slices/fileSlice';

// Utils
import { formatNumber, formatFileSize, formatDate, formatDuration } from '../../utils/formatters';

const FilesSummaryCard = ({ data = [], loading = false, title = "File Processing Summary" }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { stats, ui } = useAppSelector((state) => state.files);

  // Load file stats on mount
  React.useEffect(() => {
    dispatch(fetchFileStats());
  }, [dispatch]);

  const handleViewUpload = () => {
    navigate('/upload');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <SuccessIcon color="success" fontSize="small" />;
      case 'error':
      case 'failed':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'processing':
        return <ProcessingIcon color="warning" fontSize="small" />;
      default:
        return <FileIcon color="primary" fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'success':
        return 'success';
      case 'error':
      case 'failed':
        return 'error';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const isLoading = loading || stats.loading;
  const uploadHistory = ui.uploadHistory || [];
  const fileStats = stats.data;

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
          </Box>
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="50%" />
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <StatsIcon color="primary" />
        </Box>

        {/* Database Statistics */}
        {fileStats && (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(fileStats.totalRecords || 0)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Records in Database
              </Typography>
            </Box>

            {/* Record Types Breakdown */}
            {fileStats.statistics && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Record Types
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Object.entries(fileStats.statistics)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([type, count]) => (
                    <Chip
                      key={type}
                      label={`${type}: ${formatNumber(count)}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Recent Upload History */}
        <Typography variant="subtitle2" gutterBottom>
          Recent File Uploads
        </Typography>

        {uploadHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <UploadIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No recent uploads
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleViewUpload}
              startIcon={<UploadIcon />}
            >
              Upload File
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ p: 0 }}>
              {uploadHistory.slice(0, 3).map((upload, index) => (
                <ListItem
                  key={upload.id || index}
                  sx={{
                    px: 0,
                    py: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {getStatusIcon(upload.status)}
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500} noWrap>
                          {upload.filename}
                        </Typography>
                        <Chip
                          label={upload.status}
                          size="small"
                          color={getStatusColor(upload.status)}
                          sx={{ height: 18, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(upload.recordCount)} records processed
                        </Typography>
                        {upload.processingTime && (
                          <Typography variant="caption" color="text.secondary">
                            {' • '}
                            {formatDuration(upload.processingTime)}
                          </Typography>
                        )}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(upload.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />

                  {upload.status === 'success' && (
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" color="success.main" fontWeight={500}>
                          ✓ Success
                        </Typography>
                      </Box>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>

            {/* Upload Actions */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleViewUpload}
                startIcon={<UploadIcon />}
                sx={{ flex: 1 }}
              >
                Upload New File
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={handleViewUpload}
                endIcon={<ViewIcon />}
              >
                View All
              </Button>
            </Box>
          </>
        )}

        {/* Processing Status */}
        {stats.data?.processing?.isProcessing && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ProcessingIcon sx={{ mr: 1 }} />
              <Typography variant="body2" fontWeight={500}>
                Processing in Progress
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {stats.data.processing.currentStep}
            </Typography>
            <LinearProgress sx={{ mt: 1 }} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesSummaryCard;