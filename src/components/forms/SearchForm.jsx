
// src/components/forms/SearchForm.jsx
import React from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Paper,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Utils
import { schemas } from '../../utils/validators';

const SearchForm = ({
  onSearch,
  onClear,
  defaultValues = {},
  showFilters = true,
  showHistory = true,
  searchHistory = [],
  placeholder = 'Search...',
  searchTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'transactions', label: 'Transactions' },
    { value: 'tickets', label: 'Tickets' },
    { value: 'passengers', label: 'Passengers' },
    { value: 'offices', label: 'Offices' },
  ],
  loading = false,
}) => {
  const theme = useTheme();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemas.searchForm),
    defaultValues: {
      query: '',
      type: 'all',
      ...defaultValues,
    },
  });

  const watchedQuery = watch('query');

  const handleFormSubmit = (data) => {
    onSearch?.(data);
  };

  const handleClear = () => {
    reset();
    onClear?.();
  };

  const handleHistoryClick = (query) => {
    setValue('query', query);
    handleSubmit(handleFormSubmit)();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(handleFormSubmit)();
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          {/* Search Input */}
          <Controller
            name="query"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder={placeholder}
                error={!!errors.query}
                helperText={errors.query?.message}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: watchedQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setValue('query', '')}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Search Type */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select {...field} label="Type">
                  {searchTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Search Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ px: 4 }}
          >
            Search
          </Button>

          {/* Advanced Filters Toggle */}
          {showFilters && (
            <IconButton
              onClick={() => setShowAdvanced(!showAdvanced)}
              color={showAdvanced ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
          )}

          {/* Clear Button */}
          <Button
            variant="outlined"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </Button>
        </Box>

        {/* Advanced Filters */}
        {showFilters && (
          <Collapse in={showAdvanced}>
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Advanced Filters
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Add additional filter controls here */}
                <TextField
                  size="small"
                  label="Agent Code"
                  placeholder="e.g., ABC123"
                />
                <TextField
                  size="small"
                  label="Date From"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  size="small"
                  label="Date To"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          </Collapse>
        )}
      </form>

      {/* Search History */}
      {showHistory && searchHistory.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Recent Searches
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchHistory.slice(0, 5).map((query, index) => (
              <Chip
                key={index}
                label={query}
                size="small"
                variant="outlined"
                icon={<HistoryIcon />}
                onClick={() => handleHistoryClick(query)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SearchForm;