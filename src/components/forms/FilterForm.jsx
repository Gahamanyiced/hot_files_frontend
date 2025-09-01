// src/components/forms/FilterForm.jsx
import React from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Divider,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Utils
import { schemas } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';

const FilterForm = ({
  onApplyFilters,
  onClearFilters,
  filters = {},
  filterConfig = {},
  loading = false,
  title = 'Filters',
  collapsible = true,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemas.filterForm),
    defaultValues: filters,
  });

  const watchedFilters = watch();

  const handleApply = (data) => {
    // Remove empty values
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    onApplyFilters?.(cleanedData);
  };

  const handleClear = () => {
    reset();
    onClearFilters?.();
  };

  const getActiveFiltersCount = () => {
    return Object.values(watchedFilters).filter(
      value => value !== null && value !== undefined && value !== ''
    ).length;
  };

  const renderFilterField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <TextField
                {...formField}
                fullWidth
                label={field.label}
                placeholder={field.placeholder}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                size="small"
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <FormControl fullWidth size="small">
                <InputLabel>{field.label}</InputLabel>
                <Select {...formField} label={field.label}>
                  <MenuItem value="">All</MenuItem>
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        );

      case 'date':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <DatePicker
                {...formField}
                label={field.label}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors[field.name],
                    helperText: errors[field.name]?.message,
                  },
                }}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <TextField
                {...formField}
                fullWidth
                type="number"
                label={field.label}
                placeholder={field.placeholder}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                size="small"
                InputProps={{
                  startAdornment: field.prefix,
                  endAdornment: field.suffix,
                }}
              />
            )}
          />
        );

      default:
        return null;
    }
  };

  const defaultFields = [
    {
      name: 'agentCode',
      type: 'text',
      label: 'Agent Code',
      placeholder: 'e.g., ABC123',
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Start Date',
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End Date',
    },
    {
      name: 'currency',
      type: 'select',
      label: 'Currency',
      options: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
      ],
    },
    {
      name: 'minAmount',
      type: 'number',
      label: 'Min Amount',
      prefix: '$',
    },
    {
      name: 'maxAmount',
      type: 'number',
      label: 'Max Amount',
      prefix: '$',
    },
  ];

  const fields = filterConfig.fields || defaultFields;

  return (
    <Paper elevation={1} sx={{ mb: 2 }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: collapsible ? 'pointer' : 'default',
        }}
        onClick={collapsible ? () => setExpanded(!expanded) : undefined}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon />
          <Typography variant="h6">{title}</Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip
              size="small"
              label={getActiveFiltersCount()}
              color="primary"
            />
          )}
        </Box>
        {collapsible && (
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      {/* Filter Content */}
      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ p: 2 }}>
          <form onSubmit={handleSubmit(handleApply)}>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid
                  item
                  xs={12}
                  sm={field.width || 6}
                  md={field.width || 4}
                  key={field.name}
                >
                  {renderFilterField(field)}
                </Grid>
              ))}
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<FilterIcon />}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={loading}
                startIcon={<ClearIcon />}
              >
                Clear All
              </Button>
            </Box>
          </form>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterForm;