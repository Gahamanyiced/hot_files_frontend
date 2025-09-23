// src/components/errorLogs/ErrorLogBulkActions.jsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const ErrorLogBulkActions = ({
  selectedCount = 0,
  onDelete,
  onExport,
  onClearSelection,
  loading = false,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete?.();
    setDeleteConfirmOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'primary.50',
          border: '1px solid',
          borderColor: 'primary.200',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`${selectedCount} selected`}
            color="primary"
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            Bulk actions available
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Export Selected">
            <span>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={onExport}
                disabled={loading}
              >
                Export
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Delete Selected">
            <span>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                disabled={loading}
              >
                Delete
              </Button>
            </span>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Tooltip title="Clear Selection">
            <IconButton
              size="small"
              onClick={onClearSelection}
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Confirm Bulk Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedCount} selected error log
            {selectedCount > 1 ? 's' : ''}? This action cannot be undone.
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
            <Typography variant="body2" color="warning.dark">
              <strong>Warning:</strong> Deleting error logs will permanently
              remove all associated error details, validation failures, and
              debugging information.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDeleteCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={16} /> : <DeleteIcon />
            }
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ErrorLogBulkActions;
