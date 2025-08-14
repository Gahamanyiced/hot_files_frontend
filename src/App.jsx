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
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
            borderRadius: 12,
          },
        },
      },
    },
  });

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { darkMode, primaryColor } = useAppSelector((state) => state.ui);
  const theme = createAppTheme(darkMode, primaryColor);

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
          autoHideDuration={5000}
        >
          <Router>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <AppRoutes />
              <LoadingOverlay />
              <NotificationManager />
            </Box>
          </Router>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Main App Routes with Layout */}
      <Route path="/" element={<AppLayout />}>
        {/* Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Transactions */}
        <Route path="transactions" element={<Transactions />} />
        <Route
          path="transactions/:transactionNumber"
          element={<TransactionDetails />}
        />
        <Route path="tickets/:ticketNumber" element={<TicketDetails />} />

        {/* Analytics */}
        <Route path="analytics" element={<Analytics />} />

        {/* Offices */}
        <Route path="offices" element={<Offices />} />
        <Route path="offices/:agentCode" element={<OfficeDetails />} />

        {/* Passengers */}
        <Route path="passengers" element={<Passengers />} />
        <Route
          path="passengers/:transactionNumber"
          element={<PassengerDetails />}
        />

        {/* Reports */}
        <Route path="reports" element={<Reports />} />

        {/* File Management */}
        <Route path="upload" element={<FileUpload />} />

        {/* Search */}
        <Route path="search" element={<Search />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />

        {/* Help */}
        <Route path="help" element={<Help />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
