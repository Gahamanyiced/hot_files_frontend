import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2),
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    if (process.env.NODE_ENV === 'production') {
      // Log to error reporting service
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Implement error logging to service like Sentry, LogRocket, etc.
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId,
      };
      
      // Send to error reporting service
      console.log('Error report:', errorReport);
    } catch (reportingError) {
      console.error('Failed to log error:', reportingError);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            backgroundColor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              textAlign: 'center',
            }}
          >
            {/* Error Icon */}
            <ErrorIcon
              sx={{
                fontSize: 64,
                color: 'error.main',
                mb: 2,
              }}
            />

            {/* Error Title */}
            <Typography variant="h4" component="h1" gutterBottom>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We're sorry, but an unexpected error occurred. The error has been logged and our team will investigate.
            </Typography>

            {/* Error ID */}
            {this.state.errorId && (
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<BugReportIcon />}
                  label={`Error ID: ${this.state.errorId}`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
                size="large"
              >
                Try Again
              </Button>

              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
                size="large"
              >
                Go to Dashboard
              </Button>

              <Button
                variant="outlined"
                onClick={this.handleReload}
                size="large"
              >
                Reload Page
              </Button>
            </Box>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Accordion sx={{ mt: 3, textAlign: 'left' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">
                    <BugReportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Error Details (Development Only)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2" component="div">
                      <strong>Error Message:</strong>
                      <br />
                      {this.state.error.message}
                    </Typography>
                  </Alert>

                  {this.state.error.stack && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Stack Trace:
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          backgroundColor: 'grey.100',
                          overflow: 'auto',
                          maxHeight: 200,
                        }}
                      >
                        <Typography
                          variant="body2"
                          component="pre"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            whiteSpace: 'pre-wrap',
                            margin: 0,
                          }}
                        >
                          {this.state.error.stack}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {this.state.errorInfo && this.state.errorInfo.componentStack && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Component Stack:
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          backgroundColor: 'grey.100',
                          overflow: 'auto',
                          maxHeight: 200,
                        }}
                      >
                        <Typography
                          variant="body2"
                          component="pre"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            whiteSpace: 'pre-wrap',
                            margin: 0,
                          }}
                        >
                          {this.state.errorInfo.componentStack}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            )}

            {/* Production Error Reporting */}
            {process.env.NODE_ENV === 'production' && (
              <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="body2">
                  If this problem persists, please contact support with Error ID: <strong>{this.state.errorId}</strong>
                </Typography>
              </Alert>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;