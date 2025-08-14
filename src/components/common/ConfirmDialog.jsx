import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Help as QuestionIcon,
} from '@mui/icons-material';

const ConfirmDialog = ({
  open = false,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  severity = 'warning', // 'warning', 'error', 'info', 'success', 'question'
  variant = 'outlined', // 'contained', 'outlined', 'text'
  showIcon = true,
  showCloseButton = true,
  disableBackdropClick = false,
  disableEscapeKey = false,
  loading = false,
  maxWidth = 'xs',
  fullWidth = true,
  children,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    if (disableEscapeKey && reason === 'escapeKeyDown') {
      return;
    }
    onClose?.(event, reason);
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  const getIcon = () => {
    switch (severity) {
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main, fontSize: 40 }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main, fontSize: 40 }} />;
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main, fontSize: 40 }} />;
      case 'success':
        return <SuccessIcon sx={{ color: theme.palette.success.main, fontSize: 40 }} />;
      case 'question':
        return <QuestionIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />;
      default:
        return <WarningIcon sx={{ color: theme.palette.warning.main, fontSize: 40 }} />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return confirmColor;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={isMobile && maxWidth === 'xs'}
      disableEscapeKeyDown={disableEscapeKey}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
        },
      }}
      {...props}
    >
      {/* Dialog Title */}
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {showIcon && getIcon()}
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
          
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ px: 3, py: 2 }}>
        {message && (
          <DialogContentText sx={{ mb: description ? 2 : 0 }}>
            {message}
          </DialogContentText>
        )}
        
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}

        {/* Custom Alert for additional context */}
        {severity === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. Please confirm you want to proceed.
          </Alert>
        )}

        {severity === 'warning' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please review the details before confirming.
          </Alert>
        )}

        {/* Custom children content */}
        {children}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleCancel}
          disabled={loading}
          variant="outlined"
          color="inherit"
          size="large"
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant={variant}
          color={getSeverityColor()}
          size="large"
          sx={{ minWidth: 100 }}
          autoFocus
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Predefined dialog variants for common use cases
export const DeleteConfirmDialog = (props) => (
  <ConfirmDialog
    severity="error"
    confirmText="Delete"
    confirmColor="error"
    variant="contained"
    title="Confirm Deletion"
    message="Are you sure you want to delete this item?"
    description="This action cannot be undone."
    {...props}
  />
);

export const SaveConfirmDialog = (props) => (
  <ConfirmDialog
    severity="question"
    confirmText="Save"
    confirmColor="primary"
    variant="contained"
    title="Save Changes"
    message="Do you want to save your changes?"
    {...props}
  />
);

export const DiscardConfirmDialog = (props) => (
  <ConfirmDialog
    severity="warning"
    confirmText="Discard"
    confirmColor="warning"
    variant="contained"
    title="Discard Changes"
    message="You have unsaved changes. Do you want to discard them?"
    description="Any unsaved changes will be lost."
    {...props}
  />
);

export const LogoutConfirmDialog = (props) => (
  <ConfirmDialog
    severity="question"
    confirmText="Logout"
    confirmColor="primary"
    variant="contained"
    title="Confirm Logout"
    message="Are you sure you want to logout?"
    {...props}
  />
);

export const RefreshConfirmDialog = (props) => (
  <ConfirmDialog
    severity="info"
    confirmText="Refresh"
    confirmColor="primary"
    variant="contained"
    title="Refresh Data"
    message="This will reload all data from the server."
    description="Any unsaved changes may be lost."
    {...props}
  />
);

export default ConfirmDialog;