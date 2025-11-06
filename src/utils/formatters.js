// src/utils/formatters.js - Utility functions for formatting data

/**
 * Parse EDIFACT-style amount strings (e.g. "0000014142A")
 * @param {string} amountStr - EDIFACT amount string (last char is sign indicator)
 * @returns {number} Parsed numeric amount
 */
export const parseEdifactAmount = (amountStr) => {
  if (!amountStr) return 0;

  // Extract sign character (last char)
  const signChar = amountStr.slice(-1);
  const sign = signChar === '{' ? -1 : 1; // '{' indicates negative in EDIFACT
  const numeric = parseInt(amountStr.slice(0, -1), 10);

  if (isNaN(numeric)) return 0;

  // EDIFACT typically stores amounts in cents (divide by 100)
  return (numeric / 100) * sign;
};

/**
 * Format currency amount
 * @param {number|string} amount - The amount to format (can be EDIFACT string)
 * @param {string} currency - Currency code (USD, EUR, XAF, etc.)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  // Handle EDIFACT-style strings (e.g. "0000014142A")
  if (typeof amount === 'string' && /^[0-9]+[A-Z{]$/.test(amount)) {
    amount = parseEdifactAmount(amount);
  }

  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency} 0.00`;
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    XAF: 'XAF ',
    CAD: 'CA$',
  };

  const symbol = currencySymbols[currency] || currency + ' ';
  const symbolPosition = ['XAF'].includes(currency) ? 'suffix' : 'prefix';

  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (symbolPosition === 'prefix') {
    return `${sign}${symbol}${formatted}`;
  } else {
    return `${sign}${formatted} ${symbol.trim()}`;
  }
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return Math.round(num).toLocaleString('en-US');
};

/**
 * Format date from YYMMDD to readable format
 */
export const formatDate = (dateStr, format = 'medium') => {
  if (!dateStr || dateStr.length !== 6) {
    return 'Invalid Date';
  }

  try {
    const yy = dateStr.substring(0, 2);
    const mm = dateStr.substring(2, 4);
    const dd = dateStr.substring(4, 6);
    const year = parseInt(`20${yy}`);
    const month = parseInt(mm) - 1;
    const day = parseInt(dd);
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const options = {
      short: { month: 'short', day: 'numeric', year: '2-digit' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { month: 'long', day: 'numeric', year: 'numeric' },
    };

    return date.toLocaleDateString('en-US', options[format] || options.medium);
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return '-';
  const date = typeof datetime === 'string' ? new Date(datetime) : datetime;
  if (isNaN(date.getTime())) return 'Invalid DateTime';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format agent code
 */
export const formatAgentCode = (agentCode) => {
  if (!agentCode) return 'N/A';
  if (agentCode.length === 8)
    return `${agentCode.slice(0, 4)}-${agentCode.slice(4)}`;
  return agentCode;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format duration
 */
export const formatDuration = (ms) => {
  if (!ms || ms < 0) return '0s';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Format ticket number
 */
export const formatTicketNumber = (ticketNumber) => {
  if (!ticketNumber) return 'N/A';
  if (ticketNumber.length === 13) {
    return `${ticketNumber.slice(0, 3)}-${ticketNumber.slice(3)}`;
  }
  return ticketNumber;
};

/**
 * Format transaction number
 */
export const formatTransactionNumber = (trxNumber) => {
  if (!trxNumber) return 'N/A';
  const num = parseInt(trxNumber);
  return num ? `TXN-${String(num).padStart(6, '0')}` : 'N/A';
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format CUTP (Currency Type)
 */
export const formatCUTP = (cutp) => {
  if (!cutp) return 'N/A';
  return cutp.replace(/\d+$/, '');
};

/**
 * Format exchange rate
 */
export const formatExchangeRate = (rate, decimals = 4) => {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return '1.0000';
  }
  return rate.toFixed(decimals);
};

/**
 * Format compact number (K, M, B)
 */
export const formatCompactNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (absNum >= 1e9) return `${sign}${(absNum / 1e9).toFixed(1)}B`;
  if (absNum >= 1e6) return `${sign}${(absNum / 1e6).toFixed(1)}M`;
  if (absNum >= 1e3) return `${sign}${(absNum / 1e3).toFixed(1)}K`;
  return `${sign}${absNum.toFixed(0)}`;
};

/**
 * Format status text
 */
export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  const statusMap = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    processing: 'Processing',
    success: 'Success',
    error: 'Error',
  };
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Parse and format date/time helpers
 */
export const parseAPIDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 6) return null;
  try {
    const yy = dateStr.substring(0, 2);
    const mm = dateStr.substring(2, 4);
    const dd = dateStr.substring(4, 6);
    const year = parseInt(`20${yy}`);
    const month = parseInt(mm) - 1;
    const day = parseInt(dd);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

export const formatDateToAPI = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return null;
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
};

/**
 * Format passenger name
 */
export const formatPassengerName = (name) => {
  if (!name) return 'Unknown Passenger';
  if (name.includes('/')) {
    const [last, first] = name.split('/');
    return (
      `${first?.trim() || ''} ${last?.trim() || ''}`.trim() ||
      'Unknown Passenger'
    );
  }
  return name;
};

/**
 * Format time
 */
export const formatTime = (timeStr) => {
  if (!timeStr || timeStr.length !== 4) return 'Invalid Time';
  const hours = timeStr.substring(0, 2);
  const minutes = timeStr.substring(2, 4);
  return `${hours}:${minutes}`;
};

/**
 * Relative time
 */
export const formatTimeAgo = (dateStr) => {
  const date = parseAPIDate(dateStr);
  if (!date) return 'Unknown date';
  return getRelativeTime(date);
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(then.getTime())) return 'Invalid date';
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  return formatDate(formatDateToAPI(then));
};

export default {
  parseEdifactAmount,
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatPercentage,
  formatAgentCode,
  formatFileSize,
  formatDuration,
  formatTicketNumber,
  formatTransactionNumber,
  truncateText,
  formatCUTP,
  formatExchangeRate,
  formatCompactNumber,
  formatStatus,
  parseAPIDate,
  formatDateToAPI,
  getRelativeTime,
  formatPassengerName,
  formatTime,
  formatTimeAgo,
};
