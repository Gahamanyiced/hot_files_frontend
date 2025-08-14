import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Box,
  Autocomplete,
  Paper,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

// Hooks
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({
  value = '',
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search...',
  suggestions = [],
  searchHistory = [],
  loading = false,
  disabled = false,
  size = 'medium',
  variant = 'outlined',
  fullWidth = true,
  showSuggestions = true,
  showHistory = true,
  debounceMs = 300,
  ...props
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const debouncedValue = useDebounce(inputValue, debounceMs);

  // Update parent when debounced value changes
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange?.(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  // Update input when external value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setOpen(newValue.length > 0 && (suggestions.length > 0 || searchHistory.length > 0));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    onSearch?.(inputValue);
    setOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    onClear?.();
    setOpen(false);
  };

  const handleSuggestionSelect = (suggestion) => {
    setInputValue(suggestion.value || suggestion);
    onChange?.(suggestion.value || suggestion);
    onSearch?.(suggestion.value || suggestion);
    setOpen(false);
  };

  const allOptions = [
    // Add search history
    ...(showHistory && searchHistory.length > 0 ? [
      { type: 'history-header', label: 'Recent Searches' },
      ...searchHistory.slice(0, 5).map(item => ({
        type: 'history',
        value: item.query || item,
        label: item.query || item,
        icon: HistoryIcon,
      }))
    ] : []),
    
    // Add suggestions
    ...(showSuggestions && suggestions.length > 0 ? [
      ...(searchHistory.length > 0 ? [{ type: 'divider' }] : []),
      { type: 'suggestions-header', label: 'Suggestions' },
      ...suggestions.slice(0, 8).map(item => ({
        type: 'suggestion',
        value: item.value || item,
        label: item.label || item,
        description: item.description,
        icon: TrendingIcon,
      }))
    ] : []),
  ];

  const renderOption = (props, option) => {
    if (option.type === 'history-header' || option.type === 'suggestions-header') {
      return (
        <Box key={option.label} sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {option.label}
          </Typography>
        </Box>
      );
    }

    if (option.type === 'divider') {
      return <Box key="divider" sx={{ borderTop: 1, borderColor: 'divider', mx: 1 }} />;
    }

    const Icon = option.icon;

    return (
      <Box
        {...props}
        key={option.value}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 1,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        onClick={() => handleSuggestionSelect(option)}
      >
        {Icon && (
          <Icon 
            fontSize="small" 
            sx={{ 
              color: option.type === 'history' ? 'text.secondary' : 'primary.main',
            }} 
          />
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2">
            {option.label}
          </Typography>
          {option.description && (
            <Typography variant="caption" color="text.secondary">
              {option.description}
            </Typography>
          )}
        </Box>
        {option.type === 'history' && (
          <Chip label="Recent" size="small" variant="outlined" />
        )}
      </Box>
    );
  };

  if (showSuggestions || showHistory) {
    return (
      <Autocomplete
        freeSolo
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={inputValue}
        onInputChange={(event, newValue) => {
          if (event) {
            handleInputChange(event);
          }
        }}
        options={allOptions}
        filterOptions={(x) => x} // Don't filter, we provide pre-filtered options
        getOptionLabel={(option) => option.label || option}
        renderOption={renderOption}
        renderInput={(params) => (
          <TextField
            {...params}
            {...props}
            placeholder={placeholder}
            size={size}
            variant={variant}
            fullWidth={fullWidth}
            disabled={disabled}
            onKeyPress={handleKeyPress}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <Box sx={{ width: 20, height: 20 }}>
                      <div className="loading" />
                    </Box>
                  ) : inputValue ? (
                    <Tooltip title="Clear">
                      <IconButton size="small" onClick={handleClear}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </InputAdornment>
              ),
            }}
          />
        )}
        PaperComponent={(props) => (
          <Paper {...props} sx={{ mt: 1, boxShadow: 3 }} />
        )}
      />
    );
  }

  // Simple search bar without suggestions
  return (
    <TextField
      {...props}
      value={inputValue}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {loading ? (
              <Box sx={{ width: 20, height: 20 }}>
                <div className="loading" />
              </Box>
            ) : inputValue ? (
              <Tooltip title="Clear">
                <IconButton size="small" onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;