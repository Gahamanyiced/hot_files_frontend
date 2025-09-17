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
  TextField,
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
  const recordTypes = [
    'BFH01',
    'BCH02',
    'BOH03',
    'BKT06',
    'BKS24',
    'BKS30',
    'BKS39',
    'BKS42',
    'BKS45',
    'BKS46',
    'BKI63',
    'BAR64',
    'BAR65',
    'BAR66',
    'BCC82',
    'BMD75',
    'BMD76',
    'BKF81',
    'BKP84',
    'BOT93',
    'BOT94',
    'BCT95',
    'BFT99',
  ];

  const errorTypes = [
    { value: 'validation', label: 'Validation Errors' },
    { value: 'save', label: 'Save Errors' },
    { value: 'all', label: 'All Errors' },
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status) count++;
    if (filters.hasErrors) count++;
    if (filters.recordType) count++;
    if (filters.errorType) count++;
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
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => onFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Has Errors</InputLabel>
              <Select
                value={filters.hasErrors}
                label="Has Errors"
                onChange={(e) => onFilterChange('hasErrors', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">With Errors</MenuItem>
                <MenuItem value="false">No Errors</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Record Type</InputLabel>
              <Select
                value={filters.recordType}
                label="Record Type"
                onChange={(e) => onFilterChange('recordType', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {recordTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Error Type</InputLabel>
              <Select
                value={filters.errorType}
                label="Error Type"
                onChange={(e) => onFilterChange('errorType', e.target.value)}
              >
                <MenuItem value="">All Errors</MenuItem>
                {errorTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => onFilterChange('startDate', date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => onFilterChange('endDate', date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="File Name"
              value={filters.fileName || ''}
              onChange={(e) => onFilterChange('fileName', e.target.value)}
              placeholder="Search by file name..."
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Upload ID"
              value={filters.uploadId || ''}
              onChange={(e) => onFilterChange('uploadId', e.target.value)}
              placeholder="Search by upload ID..."
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ErrorLogFilters;
