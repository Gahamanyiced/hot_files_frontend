import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Grid,
  Paper,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  Receipt as TransactionIcon,
  ConfirmationNumber as TicketIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Flight as FlightIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  performGlobalSearch,
  performQuickLookup,
  setSearchQuery,
  setLookupType,
  setLookupValue,
  setActiveTab,
  clearGlobalSearchResults,
  clearQuickLookupResult,
  selectSearchResultsByCategory,
  selectTotalSearchResults,
} from '../store/slices/searchSlice';
import { addNotification } from '../store/slices/uiSlice';

// Utils
import {
  formatCurrency,
  formatDate,
  formatPassengerName,
  formatAgentCode,
  formatTicketNumber,
} from '../utils/formatters';

const Search = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { globalSearch, quickLookup, searchHistory, ui } = useAppSelector(
    (state) => state.search
  );

  // Use the new selectors
  const searchResults = useAppSelector(selectSearchResultsByCategory);
  const totalResults = useAppSelector(selectTotalSearchResults);

  const [searchInput, setSearchInput] = React.useState('');
  const [lookupInput, setLookupInput] = React.useState('');

  // Get URL params for pre-filling search
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
      setSearchInput(queryParam);
      dispatch(setSearchQuery(queryParam));
      handleGlobalSearch(queryParam);
    }
  }, []);

  const handleGlobalSearch = (query = searchInput) => {
    if (!query.trim()) return;

    dispatch(
      performGlobalSearch({
        query: query.trim(),
        type: 'all',
        limit: 20,
      })
    );
  };

  const handleQuickLookup = () => {
    if (!lookupInput.trim() || !quickLookup.type) return;

    dispatch(
      performQuickLookup({
        type: quickLookup.type,
        value: lookupInput.trim(),
      })
    );
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    dispatch(setSearchQuery(event.target.value));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleGlobalSearch();
  };

  const handleLookupInputChange = (event) => {
    setLookupInput(event.target.value);
    dispatch(setLookupValue(event.target.value));
  };

  const handleLookupSubmit = (event) => {
    event.preventDefault();
    handleQuickLookup();
  };

  const handleHistoryItemClick = (historyItem) => {
    if (ui.activeTab === 0) {
      setSearchInput(historyItem.query);
      dispatch(setSearchQuery(historyItem.query));
      handleGlobalSearch(historyItem.query);
    } else {
      setLookupInput(historyItem.value);
      dispatch(setLookupValue(historyItem.value));
      dispatch(setLookupType(historyItem.type));
      handleQuickLookup();
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    dispatch(setSearchQuery(''));
    dispatch(clearGlobalSearchResults());
  };

  const clearLookup = () => {
    setLookupInput('');
    dispatch(setLookupValue(''));
    dispatch(clearQuickLookupResult());
  };

  const quickLookupTypes = [
    { value: 'transaction', label: 'Transaction Number' },
    { value: 'ticket', label: 'Ticket Number' },
    { value: 'passenger', label: 'Passenger Name' },
    { value: 'agent', label: 'Agent Code' },
  ];

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
        Global Search
      </Typography>

      {/* Search Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={ui.activeTab}
          onChange={(event, newValue) => dispatch(setActiveTab(newValue))}
        >
          <Tab label="Global Search" />
          <Tab label="Quick Lookup" />
        </Tabs>
      </Box>

      {/* Global Search Tab */}
      <TabPanel value={ui.activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* Search Input */}
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <form onSubmit={handleSearchSubmit}>
                <TextField
                  fullWidth
                  placeholder="Search transactions, passengers, tickets, offices..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchInput && (
                      <InputAdornment position="end">
                        <IconButton onClick={clearSearch} size="small">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  disabled={!searchInput.trim() || globalSearch.loading}
                >
                  {globalSearch.loading ? 'Searching...' : 'Search'}
                </Button>
              </form>
            </Paper>

            {/* Search Results */}
            {globalSearch.loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {globalSearch.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Search failed: {globalSearch.error}
              </Alert>
            )}

            {/* Results Summary */}
            {!globalSearch.loading && globalSearch.data && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Found {totalResults} result(s) for "{globalSearch.query}"
                <Box
                  component="span"
                  sx={{
                    ml: 2,
                    display: 'inline-flex',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  {searchResults.tickets.length > 0 && (
                    <Chip
                      label={`Tickets: ${searchResults.tickets.length}`}
                      size="small"
                    />
                  )}
                  {searchResults.passengers.length > 0 && (
                    <Chip
                      label={`Passengers: ${searchResults.passengers.length}`}
                      size="small"
                    />
                  )}
                  {searchResults.agents.length > 0 && (
                    <Chip
                      label={`Agents: ${searchResults.agents.length}`}
                      size="small"
                    />
                  )}
                  {searchResults.transactions.length > 0 && (
                    <Chip
                      label={`Transactions: ${searchResults.transactions.length}`}
                      size="small"
                    />
                  )}
                </Box>
              </Alert>
            )}

            {/* Tickets Results */}
            {searchResults.tickets.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <TicketIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Tickets ({searchResults.tickets.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    {searchResults.tickets.map((ticket, index) => (
                      <Grid item xs={12} key={ticket._id || index}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              boxShadow: 2,
                            },
                          }}
                          onClick={() =>
                            navigate(`/transactions/${ticket.TRNN}`)
                          }
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Ticket Number
                              </Typography>
                              <Typography
                                variant="body1"
                                fontFamily="monospace"
                                fontWeight={600}
                              >
                                {formatTicketNumber(ticket.TDNR)}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Transaction Number
                              </Typography>
                              <Typography
                                variant="body1"
                                fontFamily="monospace"
                              >
                                TXN-{ticket.TRNN}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Issue Date
                              </Typography>
                              <Typography variant="body1">
                                {formatDate(ticket.DAIS)}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Agent Code
                              </Typography>
                              <Typography
                                variant="body1"
                                fontFamily="monospace"
                              >
                                {formatAgentCode(ticket.AGTN)}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Type
                              </Typography>
                              <Chip
                                label={ticket.TRNC || 'STD'}
                                size="small"
                                color={
                                  ticket.TRNC === 'RFND'
                                    ? 'error'
                                    : ticket.TRNC === 'EXCH'
                                    ? 'warning'
                                    : ticket.TRNC === 'VOID'
                                    ? 'secondary'
                                    : ticket.TRNC === 'EMDA'
                                    ? 'info'
                                    : 'default'
                                }
                              />
                            </Grid>
                          </Grid>

                          {ticket.PNRR && (
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                PNR:{' '}
                                <Typography
                                  component="span"
                                  variant="caption"
                                  fontFamily="monospace"
                                >
                                  {ticket.PNRR}
                                </Typography>
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Passengers Results */}
            {searchResults.passengers.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Passengers ({searchResults.passengers.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    {searchResults.passengers.map((passenger, index) => (
                      <Grid item xs={12} key={passenger._id || index}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              boxShadow: 2,
                            },
                          }}
                          onClick={() =>
                            navigate(`/passengers/${passenger.TRNN}`)
                          }
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Passenger Name
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {formatPassengerName(passenger.PXNM)}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Type
                              </Typography>
                              <Chip
                                label={passenger.PXTP || 'ADT'}
                                size="small"
                                color={
                                  passenger.PXTP === 'CHD'
                                    ? 'warning'
                                    : 'default'
                                }
                              />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Transaction
                              </Typography>
                              <Typography
                                variant="body1"
                                fontFamily="monospace"
                              >
                                TXN-{passenger.TRNN}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Transactions Results */}
            {searchResults.transactions.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <TransactionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Transactions ({searchResults.transactions.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    {searchResults.transactions.map((transaction, index) => (
                      <Grid item xs={12} key={transaction._id || index}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              boxShadow: 2,
                            },
                          }}
                          onClick={() =>
                            navigate(`/transactions/${transaction.TRNN}`)
                          }
                        >
                          <Typography variant="body1" fontWeight={600}>
                            Transaction: TXN-{transaction.TRNN}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Agents Results */}
            {searchResults.agents.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Agents ({searchResults.agents.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    {searchResults.agents.map((agent, index) => (
                      <Grid item xs={12} key={agent._id || index}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              boxShadow: 2,
                            },
                          }}
                          onClick={() => navigate(`/offices/${agent.AGTN}`)}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            Agent: {formatAgentCode(agent.AGTN)}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* No Results */}
            {!globalSearch.loading &&
              globalSearch.data &&
              totalResults === 0 && (
                <Card>
                  <CardContent>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <SearchIcon
                        sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        No results found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search terms for "
                        {globalSearch.query}"
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
          </Grid>

          {/* Search History Sidebar */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Searches
                </Typography>

                {searchHistory.queries.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No recent searches
                  </Typography>
                ) : (
                  <List dense>
                    {searchHistory.queries.slice(0, 10).map((item, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleHistoryItemClick(item)}
                        sx={{ px: 0 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <SearchIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.query}
                          secondary={formatDate(item.timestamp)}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Search Tips */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Search Tips
                </Typography>

                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Transaction Numbers"
                      secondary="Search by TXN-123456 or just 123456"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Passenger Names"
                      secondary="Use full or partial names"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Agent Codes"
                      secondary="8-digit agent codes like 12345678"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Ticket Numbers"
                      secondary="13-digit ticket numbers"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Quick Lookup Tab */}
      <TabPanel value={ui.activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* Lookup Input */}
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Lookup
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Find specific records by exact identifiers
              </Typography>

              <form onSubmit={handleLookupSubmit}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Lookup Type</InputLabel>
                      <Select
                        value={quickLookup.type}
                        label="Lookup Type"
                        onChange={(e) =>
                          dispatch(setLookupType(e.target.value))
                        }
                      >
                        {quickLookupTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      placeholder={
                        quickLookup.type === 'transaction'
                          ? 'Enter transaction number (e.g., 123456)'
                          : quickLookup.type === 'ticket'
                          ? 'Enter ticket number (e.g., 123-4567890123)'
                          : quickLookup.type === 'passenger'
                          ? 'Enter passenger name'
                          : quickLookup.type === 'agent'
                          ? 'Enter agent code (e.g., 12345678)'
                          : 'Select lookup type first'
                      }
                      value={lookupInput}
                      onChange={handleLookupInputChange}
                      disabled={!quickLookup.type}
                      InputProps={{
                        endAdornment: lookupInput && (
                          <InputAdornment position="end">
                            <IconButton onClick={clearLookup} size="small">
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  disabled={
                    !lookupInput.trim() ||
                    !quickLookup.type ||
                    quickLookup.loading
                  }
                >
                  {quickLookup.loading ? 'Looking up...' : 'Lookup'}
                </Button>
              </form>
            </Paper>

            {/* Lookup Results */}
            {quickLookup.loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {quickLookup.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Lookup failed: {quickLookup.error}
              </Alert>
            )}

            {quickLookup.result && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Lookup Result
                  </Typography>

                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Quick Lookup results will be displayed here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Lookup History Sidebar */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Lookups
                </Typography>

                {searchHistory.lookups.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No recent lookups
                  </Typography>
                ) : (
                  <List dense>
                    {searchHistory.lookups.slice(0, 10).map((item, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleHistoryItemClick(item)}
                        sx={{ px: 0 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <SearchIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.value}
                          secondary={`${item.type} • ${formatDate(
                            item.timestamp
                          )}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TrendingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Quick Actions
                </Typography>

                <List dense>
                  <ListItem
                    button
                    sx={{ px: 0 }}
                    onClick={() => {
                      dispatch(setLookupType('transaction'));
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <TransactionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Lookup Transaction" />
                  </ListItem>

                  <ListItem
                    button
                    sx={{ px: 0 }}
                    onClick={() => {
                      dispatch(setLookupType('ticket'));
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <TicketIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Lookup Ticket" />
                  </ListItem>

                  <ListItem
                    button
                    sx={{ px: 0 }}
                    onClick={() => {
                      dispatch(setLookupType('passenger'));
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Find Passenger" />
                  </ListItem>

                  <ListItem
                    button
                    sx={{ px: 0 }}
                    onClick={() => {
                      dispatch(setLookupType('agent'));
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <BusinessIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Lookup Agent" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Search;
