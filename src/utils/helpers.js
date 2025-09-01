// src/utils/helpers.js
import { format, parseISO, isValid } from 'date-fns';

// Array helpers
export const arrayHelpers = {
  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  unique: (array, key) => {
    if (key) {
      const seen = new Set();
      return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      });
    }
    return [...new Set(array)];
  },

  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (direction === 'desc') {
        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
  },

  findById: (array, id, idKey = 'id') => {
    return array.find(item => item[idKey] === id);
  },

  removeById: (array, id, idKey = 'id') => {
    return array.filter(item => item[idKey] !== id);
  },
};

// Object helpers
export const objectHelpers = {
  omit: (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },

  pick: (obj, keys) => {
    const result = {};
    keys.forEach(key => {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  },

  isEmpty: (obj) => {
    return Object.keys(obj).length === 0;
  },

  isEqual: (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  },

  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  flatten: (obj, prefix = '', result = {}) => {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        objectHelpers.flatten(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    });
    return result;
  },
};

// String helpers
export const stringHelpers = {
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  titleCase: (str) => {
    return str.split(' ').map(word => stringHelpers.capitalize(word)).join(' ');
  },

  camelCase: (str) => {
    return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  },

  kebabCase: (str) => {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  },

  truncate: (str, length = 50) => {
    if (str.length <= length) return str;
    return str.substring(0, length - 3) + '...';
  },

  removeSpecialChars: (str) => {
    return str.replace(/[^a-zA-Z0-9\s]/g, '');
  },

  generateSlug: (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  },
};

// Number helpers
export const numberHelpers = {
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  formatNumber: (number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  },

  formatPercentage: (value, decimals = 1) => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  randomBetween: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  roundTo: (number, decimals) => {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
};

// Date helpers
export const dateHelpers = {
  formatDate: (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatStr) : '';
  },

  isToday: (date) => {
    const today = new Date();
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.toDateString() === today.toDateString();
  },

  daysBetween: (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = typeof date1 === 'string' ? parseISO(date1) : date1;
    const secondDate = typeof date2 === 'string' ? parseISO(date2) : date2;
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
  },

  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  startOfDay: (date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  },

  endOfDay: (date) => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  },
};

// URL helpers
export const urlHelpers = {
  buildQueryString: (params) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    return queryParams.toString();
  },

  parseQueryString: (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  updateUrlParams: (newParams) => {
    const url = new URL(window.location);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
    window.history.replaceState({}, '', url);
  },
};

// Storage helpers
export const storageHelpers = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

// Export all helpers
export default {
  arrayHelpers,
  objectHelpers,
  stringHelpers,
  numberHelpers,
  dateHelpers,
  urlHelpers,
  storageHelpers,
};