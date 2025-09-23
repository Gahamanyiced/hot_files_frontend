// src/utils/formatters.js
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDuration = (milliseconds) => {
  if (!milliseconds) return '0ms';
  
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  const seconds = milliseconds / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(1)}m`;
  }
  
  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
};

export const formatNumber = (num) => {
  if (num == null) return '0';
  
  return new Intl.NumberFormat('en-US').format(num);
};

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

// Additional utility functions that might be needed
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercent = (value, decimals = 1) => {
  if (value == null) return '0%';
  
  return `${Number(value).toFixed(decimals)}%`;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

// Date helpers
export const isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  
  return (
    compareDate.getDate() === today.getDate() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
};

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

export const getRelativeTimeString = (date) => {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const compareDate = new Date(date);
  const diffTime = Math.abs(now - compareDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
  
  return `${Math.ceil(diffDays / 365)} years ago`;
};