import { format, parseISO, isValid } from 'date-fns';

/**
 * Format currency values
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

/**
 * Format numbers with thousand separators
 */
export const formatNumber = (value, locale = 'en-US') => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat(locale).format(numericValue);
};

/**
 * Format percentages
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numericValue.toFixed(decimals)}%`;
};

/**
 * Format dates from various formats
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';

  try {
    let dateObj;
    
    if (typeof date === 'string') {
      // Handle YYMMDD format from HOT22 data
      if (date.length === 6 && /^\d{6}$/.test(date)) {
        const year = parseInt(date.substring(0, 2)) + 2000;
        const month = parseInt(date.substring(2, 4)) - 1; // JS months are 0-indexed
        const day = parseInt(date.substring(4, 6));
        dateObj = new Date(year, month, day);
      } else if (date.includes('T') || date.includes('-')) {
        // ISO date string
        dateObj = parseISO(date);
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }

    if (!isValid(dateObj)) {
      return date; // Return original if can't parse
    }

    return format(dateObj, formatString);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return date;
  }
};

/**
 * Format time from HHMM format
 */
export const formatTime = (time) => {
  if (!time || time.length !== 4) return '';
  
  const hours = time.substring(0, 2);
  const minutes = time.substring(2, 4);
  
  return `${hours}:${minutes}`;
};

/**
 * Format passenger names
 */
export const formatPassengerName = (name) => {
  if (!name) return '';
  
  // Remove extra spaces and convert to proper case
  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format ticket numbers for display
 */
export const formatTicketNumber = (ticketNumber) => {
  if (!ticketNumber) return '';
  
  // Add spaces for readability: 123-4567890123
  if (ticketNumber.length === 14) {
    return `${ticketNumber.substring(0, 3)}-${ticketNumber.substring(3)}`;
  }
  
  return ticketNumber;
};

/**
 * Format transaction numbers
 */
export const formatTransactionNumber = (transactionNumber) => {
  if (!transactionNumber) return '';
  
  // Format as TXN-123456
  return `TXN-${transactionNumber}`;
};

/**
 * Format agent codes
 */
export const formatAgentCode = (agentCode) => {
  if (!agentCode) return '';
  
  // Format as 12345678 -> 1234-5678
  if (agentCode.length === 8) {
    return `${agentCode.substring(0, 4)}-${agentCode.substring(4)}`;
  }
  
  return agentCode;
};

/**
 * Format file sizes
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format duration in milliseconds to human readable
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds) return '0s';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Format route (origin-destination)
 */
export const formatRoute = (origin, destination) => {
  if (!origin || !destination) return '';
  return `${origin} → ${destination}`;
};

/**
 * Format commission rate
 */
export const formatCommissionRate = (rate) => {
  if (rate === null || rate === undefined) return '';
  
  const numericRate = typeof rate === 'string' ? parseFloat(rate) : rate;
  return `${numericRate.toFixed(2)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format status badges
 */
export const formatStatus = (status) => {
  if (!status) return '';
  
  return status
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format phone numbers
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as (123) 456-7890
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  
  return phoneNumber;
};

/**
 * Format relative time (time ago)
 */
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
};

// NEW UTILITY FUNCTIONS ADDED FOR ERROR LOGS

/**
 * Enhanced relative time string for error logs
 */
export const getRelativeTimeString = (date) => {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const compareDate = new Date(date);
  const diffTime = Math.abs(now - compareDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));
  
  if (isToday(date)) {
    if (diffHours < 1) {
      return `${diffMinutes}m ago`;
    }
    return `${diffHours}h ago`;
  }
  if (isYesterday(date)) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays}d ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}w ago`;
  if (diffDays <= 365) return `${Math.ceil(diffDays / 30)}mo ago`;
  
  return `${Math.ceil(diffDays / 365)}y ago`;
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  
  return (
    compareDate.getDate() === today.getDate() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const compareDate = new Date(date);
  
  return (
    compareDate.getDate() === yesterday.getDate() &&
    compareDate.getMonth() === yesterday.getMonth() &&
    compareDate.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get browser name from user agent string
 */
export const getBrowserFromUserAgent = (userAgent) => {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  
  return 'Other';
};

/**
 * Calculate error severity based on error count and total records
 */
export const calculateErrorSeverity = (errorCount, totalRecords) => {
  if (!errorCount || errorCount === 0) return 'none';
  if (!totalRecords || totalRecords === 0) return 'unknown';
  
  const errorRate = (errorCount / totalRecords) * 100;
  
  if (errorRate > 50) return 'critical';
  if (errorRate > 20) return 'high';
  if (errorRate > 5) return 'medium';
  return 'low';
};

/**
 * Get file type from file name
 */
export const getFileTypeFromName = (fileName) => {
  if (!fileName) return 'unknown';
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'txt':
      return 'text';
    case 'csv':
      return 'csv';
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    default:
      return 'unknown';
  }
};

/**
 * Format record type code to human readable name
 */
export const formatRecordType = (type) => {
  const recordTypeMap = {
    'BFH01': 'File Header',
    'BCH02': 'Commission Header',
    'BOH03': 'Office Header',
    'BKT06': 'Ticket',
    'BKS24': 'Sales Record',
    'BKS30': 'Sales Record (Extended)',
    'BKS39': 'Sales Record (Detailed)',
    'BKS42': 'Booking Record',
    'BKS45': 'Booking Record (Extended)',
    'BKS46': 'Booking Record (Detailed)',
    'BKI63': 'Itinerary',
    'BAR64': 'Passenger Record',
    'BAR65': 'Passenger (Extended)',
    'BAR66': 'Passenger (Detailed)',
    'BCC82': 'Commission',
    'BMD75': 'Market Data',
    'BMD76': 'Market Data (Extended)',
    'BKF81': 'Fare Record',
    'BKP84': 'Pricing Record',
    'BOT93': 'Other Transaction',
    'BOT94': 'Other Transaction (Extended)',
    'BCT95': 'Credit Transaction',
    'BFT99': 'File Trailer',
  };
  
  return recordTypeMap[type] || type;
};

/**
 * Format percent value
 */
export const formatPercent = (value, decimals = 1) => {
  if (value == null) return '0%';
  
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Export all formatters
 */
export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatTime,
  formatPassengerName,
  formatTicketNumber,
  formatTransactionNumber,
  formatAgentCode,
  formatFileSize,
  formatDuration,
  formatRoute,
  formatCommissionRate,
  truncateText,
  formatStatus,
  formatPhoneNumber,
  formatTimeAgo,
  // New additions
  getRelativeTimeString,
  isToday,
  isYesterday,
  getBrowserFromUserAgent,
  calculateErrorSeverity,
  getFileTypeFromName,
  formatRecordType,
  formatPercent,
};