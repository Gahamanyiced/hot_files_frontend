import React from 'react';
import {
  Box,
  TextField,
  Button,
  Popover,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  DateRange as DateRangeIcon,
  CalendarToday as CalendarIcon,
  Clear as ClearIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Utils
import { formatDate } from '../../utils/formatters';

const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  onClear,
  label = 'Select Date Range',
  placeholder = 'Select dates...',
  disabled = false,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  showPresets = true,
  showClear = true,
  maxDate,
  minDate,
  ...props
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tempStartDate, setTempStartDate] = React.useState(startDate);
  const [tempEndDate, setTempEndDate] = React.useState(endDate);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    onChange?.(tempStartDate, tempEndDate);
    handleClose();
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    handleClose();
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onClear?.();
    handleClose();
  };

  const handlePresetSelect = (preset) => {
    const today = new Date();
    let start, end;

    switch (preset) {
      case 'today':
        start = end = new Date(today);
        break;
      case 'yesterday':
        start = end = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'last7days':
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        end = new Date(today);
        break;
      case 'last30days':
        start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = new Date(today);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today);
        break;
      case 'lastYear':
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    setTempStartDate(start);
    setTempEndDate(end);
  };

  const presets = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Last 30 days', value: 'last30days' },
    { label: 'This month', value: 'thisMonth' },
    { label: 'Last month', value: 'lastMonth' },
    { label: 'This year', value: 'thisYear' },
    { label: 'Last year', value: 'lastYear' },
  ];

  const getDisplayValue = () => {
    if (!startDate && !endDate) {
      return '';
    }
    if (startDate && !endDate) {
      return formatDate(startDate);
    }
    if (!startDate && endDate) {
      return formatDate(endDate);
    }
    if (startDate && endDate) {
      if (startDate.getTime() === endDate.getTime()) {
        return formatDate(startDate);
      }
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return '';
  };

  const hasSelection = startDate || endDate;

  return (
    <Box>
      <TextField
        {...props}
        value={getDisplayValue()}
        placeholder={placeholder}
        label={label}
        size={size}
        variant={variant}
        fullWidth={fullWidth}
        disabled={disabled}
        onClick={handleClick}
        readOnly
        InputProps={{
          startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          endAdornment: showClear && hasSelection && (
            <Tooltip title="Clear dates">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleClear(); }}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          ),
        }}
        sx={{
          cursor: 'pointer',
          '& .MuiInputBase-input': {
            cursor: 'pointer',
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { p: 0, minWidth: 400 },
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Select Date Range
          </Typography>

          {/* Date Pickers */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <DatePicker
                label="Start Date"
                value={tempStartDate}
                onChange={(date) => setTempStartDate(date)}
                maxDate={tempEndDate || maxDate}
                minDate={minDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="End Date"
                value={tempEndDate}
                onChange={(date) => setTempEndDate(date)}
                minDate={tempStartDate || minDate}
                maxDate={maxDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Quick Presets */}
          {showPresets && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Quick Select
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {presets.map((preset) => (
                  <Chip
                    key={preset.value}
                    label={preset.label}
                    size="small"
                    variant="outlined"
                    clickable
                    onClick={() => handlePresetSelect(preset.value)}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              {showClear && (tempStartDate || tempEndDate) && (
                <Button
                  variant="text"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={handleClear}
                  size="small"
                >
                  Clear
                </Button>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={handleCancel} size="small">
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApply} 
                size="small"
                disabled={!tempStartDate && !tempEndDate}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
};

export default DateRangePicker;