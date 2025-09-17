// src/App.jsx - Updated to include Error Logs routes
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';

// Store
import { store } from './store';

// Layout Components
import AppLayout from './components/layout/AppLayout';
import LoadingOverlay from './components/common/LoadingOverlay';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationManager from './components/common/NotificationManager';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';
import TicketDetails from './pages/TicketDetails';
import Analytics from './pages/Analytics';
import Offices from './pages/Offices';
import OfficeDetails from './pages/OfficeDetails';
import Passengers from './pages/Passengers';
import PassengerDetails from './pages/PassengerDetails';
import Reports from './pages/Reports';
import FileUpload from './pages/FileUpload';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Help from './pages/Help';
import ErrorLogs from './pages/ErrorLogs'; // New Error Logs page
import ErrorLogDetails from './pages/ErrorLogDetails'; // New Error Log Details page

// Hooks
import { useAppSelector } from './hooks/redux';

// Theme configuration
const createAppTheme = (darkMode, primaryColor) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: '#6b6b6b #2b2b2b',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: darkMode ? '#2b2b2b' : '#f1f1f1',
              width: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              backgroundColor: darkMode ? '#6b6b6b' : '#c1c1c1',
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

// Main App Component with Provider
const AppWithProviders = () => {
  const { darkMode, primaryColor } = useAppSelector(
    (state) => state.ui.theme || { darkMode: false, primaryColor: '#1976d2' }
  );

  const theme = React.useMemo(
    () => createAppTheme(darkMode, primaryColor),
    [darkMode, primaryColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <ErrorBoundary>
            <Router>
              <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <AppLayout>
                  <Routes>
                    {/* Dashboard */}
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Transactions */}
                    <Route path="/transactions" element={<Transactions />} />
                    <Route
                      path="/transactions/:transactionNumber"
                      element={<TransactionDetails />}
                    />
                    <Route
                      path="/tickets/:ticketNumber"
                      element={<TicketDetails />}
                    />

                    {/* Analytics */}
                    <Route path="/analytics" element={<Analytics />} />

                    {/* Offices */}
                    <Route path="/offices" element={<Offices />} />
                    <Route
                      path="/offices/:agentCode"
                      element={<OfficeDetails />}
                    />

                    {/* Passengers */}
                    <Route path="/passengers" element={<Passengers />} />
                    <Route
                      path="/passengers/:transactionNumber"
                      element={<PassengerDetails />}
                    />

                    {/* Reports */}
                    <Route path="/reports" element={<Reports />} />

                    {/* File Management */}
                    <Route path="/upload" element={<FileUpload />} />

                    {/* Error Logs - New Routes */}
                    <Route path="/error-logs" element={<ErrorLogs />} />
                    <Route
                      path="/error-logs/:uploadId"
                      element={<ErrorLogDetails />}
                    />

                    {/* Search */}
                    <Route path="/search" element={<Search />} />

                    {/* Settings & Help */}
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/help" element={<Help />} />

                    {/* 404 fallback */}
                    <Route
                      path="*"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </AppLayout>
                <NotificationManager />
              </Box>
            </Router>
          </ErrorBoundary>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

// Root App Component
const App = () => {
  return (
    <Provider store={store}>
      <AppWithProviders />
    </Provider>
  );
};

export default App;
