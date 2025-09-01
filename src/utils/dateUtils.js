// src/utils/dateUtils.js
import {
  format,
  parseISO,
  isValid,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  isAfter,
  isBefore,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
} from 'date-fns';

// Date formatting utilities
export const formatters = {
  standard: (date) => format(date, 'yyyy-MM-dd'),
  display: (date) => format(date, 'MMM dd, yyyy'),
  displayWithTime: (date) => format(date, 'MMM dd, yyyy HH:mm'),
  time: (date) => format(date, 'HH:mm'),
  monthYear: (date) => format(date, 'MMM yyyy'),
  dayMonth: (date) => format(date, 'dd MMM'),
  iso: (date) => date.toISOString(),
  relative: (date) => {
    const now = new Date();
    const daysDiff = differenceInDays(now, date);
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Yesterday';
    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} weeks ago`;
    if (daysDiff < 365) return `${Math.floor(daysDiff / 30)} months ago`;
    return `${Math.floor(daysDiff / 365)} years ago`;
  },
};

// Date parsing utilities
export const parsers = {
  fromString: (dateString) => {
    try {
      return parseISO(dateString);
    } catch (error) {
      console.error('Error parsing date string:', error);
      return null;
    }
  },
  
  fromTimestamp: (timestamp) => {
    try {
      return new Date(timestamp);
    } catch (error) {
      console.error('Error parsing timestamp:', error);
      return null;
    }
  },
  
  safe: (date) => {
    if (!date) return null;
    
    if (date instanceof Date) {
      return isValid(date) ? date : null;
    }
    
    if (typeof date === 'string') {
      return parsers.fromString(date);
    }
    
    if (typeof date === 'number') {
      return parsers.fromTimestamp(date);
    }
    
    return null;
  },
};

// Date range utilities
export const ranges = {
  today: () => ({
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  }),
  
  yesterday: () => ({
    start: startOfDay(subDays(new Date(), 1)),
    end: endOfDay(subDays(new Date(), 1)),
  }),
  
  thisWeek: () => ({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date()),
  }),
  
  lastWeek: () => ({
    start: startOfWeek(subWeeks(new Date(), 1)),
    end: endOfWeek(subWeeks(new Date(), 1)),
  }),
  
  thisMonth: () => ({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  }),
  
  lastMonth: () => ({
    start: startOfMonth(subMonths(new Date(), 1)),
    end: endOfMonth(subMonths(new Date(), 1)),
  }),
  
  thisYear: () => ({
    start: startOfYear(new Date()),
    end: endOfYear(new Date()),
  }),
  
  lastYear: () => ({
    start: startOfYear(subYears(new Date(), 1)),
    end: endOfYear(subYears(new Date(), 1)),
  }),
  
  last7Days: () => ({
    start: startOfDay(subDays(new Date(), 7)),
    end: endOfDay(new Date()),
  }),
  
  last30Days: () => ({
    start: startOfDay(subDays(new Date(), 30)),
    end: endOfDay(new Date()),
  }),
  
  last90Days: () => ({
    start: startOfDay(subDays(new Date(), 90)),
    end: endOfDay(new Date()),
  }),
  
  custom: (startDate, endDate) => ({
    start: startOfDay(parsers.safe(startDate)),
    end: endOfDay(parsers.safe(endDate)),
  }),
};

// Date validation utilities
export const validators = {
  isValidDate: (date) => {
    const parsed = parsers.safe(date);
    return parsed && isValid(parsed);
  },
  
  isValidRange: (startDate, endDate) => {
    const start = parsers.safe(startDate);
    const end = parsers.safe(endDate);
    
    if (!start || !end) return false;
    return isBefore(start, end) || isSameDay(start, end);
  },
  
  isInRange: (date, startDate, endDate) => {
    const target = parsers.safe(date);
    const start = parsers.safe(startDate);
    const end = parsers.safe(endDate);
    
    if (!target || !start || !end) return false;
    
    return (isAfter(target, start) || isSameDay(target, start)) &&
           (isBefore(target, end) || isSameDay(target, end));
  },
  
  isFuture: (date) => {
    const parsed = parsers.safe(date);
    return parsed && isAfter(parsed, new Date());
  },
  
  isPast: (date) => {
    const parsed = parsers.safe(date);
    return parsed && isBefore(parsed, new Date());
  },
};

// Date calculation utilities
export const calculations = {
  age: (birthDate) => {
    const birth = parsers.safe(birthDate);
    if (!birth) return null;
    return differenceInYears(new Date(), birth);
  },
  
  duration: (startDate, endDate, unit = 'days') => {
    const start = parsers.safe(startDate);
    const end = parsers.safe(endDate);
    
    if (!start || !end) return null;
    
    switch (unit) {
      case 'days':
        return differenceInDays(end, start);
      case 'weeks':
        return differenceInWeeks(end, start);
      case 'months':
        return differenceInMonths(end, start);
      case 'years':
        return differenceInYears(end, start);
      default:
        return differenceInDays(end, start);
    }
  },
  
  addTime: (date, amount, unit = 'days') => {
    const parsed = parsers.safe(date);
    if (!parsed) return null;
    
    switch (unit) {
      case 'days':
        return addDays(parsed, amount);
      case 'weeks':
        return addWeeks(parsed, amount);
      case 'months':
        return addMonths(parsed, amount);
      case 'years':
        return addYears(parsed, amount);
      default:
        return addDays(parsed, amount);
    }
  },
  
  subtractTime: (date, amount, unit = 'days') => {
    const parsed = parsers.safe(date);
    if (!parsed) return null;
    
    switch (unit) {
      case 'days':
        return subDays(parsed, amount);
      case 'weeks':
        return subWeeks(parsed, amount);
      case 'months':
        return subMonths(parsed, amount);
      case 'years':
        return subYears(parsed, amount);
      default:
        return subDays(parsed, amount);
    }
  },
};

// Date comparison utilities
export const comparisons = {
  isSame: (date1, date2, unit = 'day') => {
    const d1 = parsers.safe(date1);
    const d2 = parsers.safe(date2);
    
    if (!d1 || !d2) return false;
    
    switch (unit) {
      case 'day':
        return isSameDay(d1, d2);
      case 'week':
        return isSameWeek(d1, d2);
      case 'month':
        return isSameMonth(d1, d2);
      case 'year':
        return isSameYear(d1, d2);
      default:
        return isSameDay(d1, d2);
    }
  },
  
  isAfterDate: (date1, date2) => {
    const d1 = parsers.safe(date1);
    const d2 = parsers.safe(date2);
    return d1 && d2 && isAfter(d1, d2);
  },
  
  isBeforeDate: (date1, date2) => {
    const d1 = parsers.safe(date1);
    const d2 = parsers.safe(date2);
    return d1 && d2 && isBefore(d1, d2);
  },
  
  sortDates: (dates, direction = 'asc') => {
    return dates
      .map(date => ({ original: date, parsed: parsers.safe(date) }))
      .filter(item => item.parsed)
      .sort((a, b) => {
        if (direction === 'desc') {
          return b.parsed.getTime() - a.parsed.getTime();
        }
        return a.parsed.getTime() - b.parsed.getTime();
      })
      .map(item => item.original);
  },
};

// Predefined date range options for filters
export const dateRangeOptions = [
  { label: 'Today', value: 'today', range: ranges.today },
  { label: 'Yesterday', value: 'yesterday', range: ranges.yesterday },
  { label: 'This Week', value: 'thisWeek', range: ranges.thisWeek },
  { label: 'Last Week', value: 'lastWeek', range: ranges.lastWeek },
  { label: 'This Month', value: 'thisMonth', range: ranges.thisMonth },
  { label: 'Last Month', value: 'lastMonth', range: ranges.lastMonth },
  { label: 'This Year', value: 'thisYear', range: ranges.thisYear },
  { label: 'Last Year', value: 'lastYear', range: ranges.lastYear },
  { label: 'Last 7 Days', value: 'last7Days', range: ranges.last7Days },
  { label: 'Last 30 Days', value: 'last30Days', range: ranges.last30Days },
  { label: 'Last 90 Days', value: 'last90Days', range: ranges.last90Days },
  { label: 'Custom Range', value: 'custom', range: null },
];

// Export all utilities
export default {
  formatters,
  parsers,
  ranges,
  validators,
  calculations,
  comparisons,
  dateRangeOptions,
};