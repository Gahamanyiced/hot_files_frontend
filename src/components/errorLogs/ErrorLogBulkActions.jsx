// src/components/errorLogs/ErrorLogBulkActions.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  SelectAll as SelectAllIcon,
} from '@mui/icons-material';

const ErrorLogBulkActions = ({
  selectedCount,
  onBulkDelete,
  onBulkExport,
  onClearSelection,
  onSelectAll,
  loading,
}) => {
  return (
    <Card sx={{ mb: 3, backgroundColor: 'action.selected' }}>
      <CardContent sx={{ py: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`${selectedCount} selected`}
              color="primary"
              variant="filled"
            />
            <Typography variant="body2" color="text.secondary">
              Bulk actions available for selected error logs
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Export Selected">
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={onBulkExport}
                disabled={loading || selectedCount === 0}
              >
                Export
              </Button>
            </Tooltip>

            <Tooltip title="Delete Selected">
              <Button
                size="small"
                startIcon={
                  loading ? <CircularProgress size={16} /> : <DeleteIcon />
                }
                onClick={onBulkDelete}
                disabled={loading || selectedCount === 0}
                color="error"
              >
                Delete
              </Button>
            </Tooltip>

            <Tooltip title="Clear Selection">
              <IconButton size="small" onClick={onClearSelection}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ErrorLogBulkActions;
