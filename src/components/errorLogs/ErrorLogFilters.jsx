// src/components/errorLogs/ErrorLogFilters.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ErrorLogFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterIcon />
            <Typography variant="h6">Advanced Filters</Typography>
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={`${getActiveFiltersCount()} active`}
                size="small"
                color="primary"
              />
            )}
          </Box>
          <Button
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            disabled={getActiveFiltersCount() === 0}
          >
            Clear All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ''}
                label="Status"
                onChange={(e) =>
                  onFilterChange('status', e.target.value || null)
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Start Date Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => onFilterChange('startDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'Select start date...',
                },
              }}
            />
          </Grid>

          {/* End Date Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => onFilterChange('endDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'Select end date...',
                },
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ErrorLogFilters;
