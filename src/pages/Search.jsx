import React from 'react';
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
  addToSearchHistory,
} from '../store/slices/searchSlice';
import { addNotification } from '../store/slices/uiSlice';

// Utils
import { formatCurrency, formatDate, formatPassengerName, formatAgentCode } from '../utils/formatters';

const Search = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  const {
    globalSearch,
    quickLookup,
    searchHistory,
    ui,
  } = useAppSelector((state) => state.search);

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
    
    dispatch(performGlobalSearch({
      query: query.trim(),
      type: 'all',
      limit: 20,
    }));
  };

  const handleQuickLookup = () => {
    if (!lookupInput.trim() || !quickLookup.type) return;
    
    dispatch(performQuickLookup({
      type: quickLookup.type,
      value: lookupInput.trim(),
    }));
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

  const getResultIcon = (type) => {
    switch (type) {
      case 'transaction':
        return <TransactionIcon />;
      case 'ticket':
        return <TicketIcon />;
      case 'passenger':
        return <PersonIcon />;
      case 'office':
        return <BusinessIcon />;
      case 'route':
        return <FlightIcon />;
      default:
        return <SearchIcon />;
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'transaction':
        return 'primary';
      case 'ticket':
        return 'secondary';
      case 'passenger':
        return 'success';
      case 'office':
        return 'warning';
      case 'route':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (result) => {
    switch (result.type) {
      case 'transaction':
        window.location.href = `/transactions/${result.id}`;
        break;
      case 'ticket':
        window.location.href = `/tickets/${result.id}`;
        break;
      case 'passenger':
        window.location.href = `/passengers/${result.id}`;
        break;
      case 'office':
        window.location.href = `/offices/${result.id}`;
        break;
      default:
        break;
    }
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

            {globalSearch.results && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Search Results
                  </Typography>
                  
                  {globalSearch.results.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No results found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search terms
                      </Typography>
                    </Box>
                  ) : (
                    <List>
                      {globalSearch.results.map((result, index) => (
                        <React.Fragment key={index}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              {getResultIcon(result.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography variant="body1" fontWeight={500}>
                                    {result.title}
                                  </Typography>
                                  <Chip 
                                    label={result.type} 
                                    size="small" 
                                    color={getResultColor(result.type)}
                                  />
                                  {result.amount && (
                                    <Chip 
                                      label={formatCurrency(result.amount)} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {result.description}
                                  </Typography>
                                  {result.metadata && (
                                    <Typography variant="caption" color="text.secondary">
                                      {Object.entries(result.metadata).map(([key, value]) => 
                                        `${key}: ${value}`
                                      ).join(' • ')}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Tooltip title="View Details">
                                <IconButton onClick={() => handleViewDetails(result)}>
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < globalSearch.results.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
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
                        onChange={(e) => dispatch(setLookupType(e.target.value))}
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
                        quickLookup.type === 'transaction' ? 'Enter transaction number (e.g., 123456)' :
                        quickLookup.type === 'ticket' ? 'Enter ticket number (e.g., 123-4567890123)' :
                        quickLookup.type === 'passenger' ? 'Enter passenger name' :
                        quickLookup.type === 'agent' ? 'Enter agent code (e.g., 12345678)' :
                        'Select lookup type first'
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
                  disabled={!lookupInput.trim() || !quickLookup.type || quickLookup.loading}
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
                  
                  {quickLookup.result ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        {getResultIcon(quickLookup.type)}
                        <Box>
                          <Typography variant="h6">
                            {quickLookup.result.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {quickLookup.result.description}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: 'auto' }}>
                          <Button
                            variant="contained"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewDetails(quickLookup.result)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Box>

                      {/* Result Details */}
                      <Grid container spacing={2}>
                        {Object.entries(quickLookup.result.details || {}).map(([key, value]) => (
                          <Grid item xs={12} sm={6} md={4} key={key}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {typeof value === 'number' && key.toLowerCase().includes('amount') 
                                  ? formatCurrency(value)
                                  : typeof value === 'string' && value.match(/^\d{6}$/)
                                  ? formatDate(value)
                                  : value
                                }
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Related Information */}
                      {quickLookup.result.related && quickLookup.result.related.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Related Records
                          </Typography>
                          <List>
                            {quickLookup.result.related.map((relatedItem, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemIcon>
                                  {getResultIcon(relatedItem.type)}
                                </ListItemIcon>
                                <ListItemText
                                  primary={relatedItem.title}
                                  secondary={relatedItem.description}
                                />
                                <ListItemSecondaryAction>
                                  <IconButton onClick={() => handleViewDetails(relatedItem)}>
                                    <ViewIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No record found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        The {quickLookup.type} "{quickLookup.value}" was not found
                      </Typography>
                    </Box>
                  )}
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
                          {getResultIcon(item.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.value}
                          secondary={`${item.type} • ${formatDate(item.timestamp)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Popular Lookups */}
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
                      dispatch(setActiveTab(1));
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
                      dispatch(setActiveTab(1));
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
                      dispatch(setActiveTab(1));
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
                      dispatch(setActiveTab(1));
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