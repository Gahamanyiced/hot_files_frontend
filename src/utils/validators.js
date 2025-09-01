// src/utils/validators.js
import * as yup from 'yup';

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  agentCode: /^[A-Z0-9]{3,8}$/,
  ticketNumber: /^[0-9]{13}$/,
  currency: /^[A-Z]{3}$/,
  numeric: /^[0-9]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
};

// Field validators
export const validators = {
  email: yup
    .string()
    .matches(patterns.email, 'Invalid email format')
    .required('Email is required'),

  optionalEmail: yup
    .string()
    .matches(patterns.email, 'Invalid email format')
    .nullable(),

  phone: yup
    .string()
    .matches(patterns.phone, 'Invalid phone number format')
    .nullable(),

  agentCode: yup
    .string()
    .matches(patterns.agentCode, 'Agent code must be 3-8 alphanumeric characters')
    .required('Agent code is required'),

  ticketNumber: yup
    .string()
    .matches(patterns.ticketNumber, 'Ticket number must be 13 digits')
    .required('Ticket number is required'),

  currency: yup
    .string()
    .matches(patterns.currency, 'Currency must be 3 letters (e.g., USD)')
    .required('Currency is required'),

  amount: yup
    .number()
    .positive('Amount must be positive')
    .required('Amount is required'),

  date: yup
    .date()
    .required('Date is required'),

  dateRange: yup.object().shape({
    startDate: yup.date().required('Start date is required'),
    endDate: yup
      .date()
      .required('End date is required')
      .min(yup.ref('startDate'), 'End date must be after start date'),
  }),

  pagination: yup.object().shape({
    page: yup.number().min(1, 'Page must be at least 1').required(),
    limit: yup
      .number()
      .min(1, 'Limit must be at least 1')
      .max(1000, 'Limit cannot exceed 1000')
      .required(),
  }),

  search: yup
    .string()
    .min(2, 'Search term must be at least 2 characters')
    .max(100, 'Search term cannot exceed 100 characters'),
};

// Form schemas
export const schemas = {
  searchForm: yup.object().shape({
    query: validators.search.required('Search query is required'),
    type: yup
      .string()
      .oneOf(['all', 'transactions', 'tickets', 'passengers', 'offices'])
      .default('all'),
  }),

  filterForm: yup.object().shape({
    agentCode: validators.agentCode.nullable(),
    startDate: yup.date().nullable(),
    endDate: yup.date().nullable(),
    currency: validators.currency.nullable(),
    minAmount: yup.number().positive().nullable(),
    maxAmount: yup.number().positive().nullable(),
  }),

  transactionFilter: yup.object().shape({
    agentCode: validators.agentCode.nullable(),
    ticketNumber: validators.ticketNumber.nullable(),
    passengerName: yup.string().max(100).nullable(),
    dateRange: validators.dateRange.nullable(),
    transactionCode: yup.string().max(10).nullable(),
  }),

  officeFilter: yup.object().shape({
    search: validators.search.nullable(),
    currency: validators.currency.nullable(),
    country: yup.string().max(50).nullable(),
    status: yup.string().oneOf(['active', 'inactive']).nullable(),
  }),

  passengerFilter: yup.object().shape({
    name: yup.string().max(100).nullable(),
    agentCode: validators.agentCode.nullable(),
    dateRange: validators.dateRange.nullable(),
    ticketNumber: validators.ticketNumber.nullable(),
  }),

  exportRequest: yup.object().shape({
    format: yup.string().oneOf(['csv', 'excel', 'pdf']).required(),
    dateRange: validators.dateRange.required(),
    filters: yup.object().nullable(),
    limit: yup.number().min(1).max(10000).default(1000),
  }),
};

// Validation helpers
export const validateField = async (schema, value) => {
  try {
    await schema.validate(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

export const validateForm = async (schema, data) => {
  try {
    const validatedData = await schema.validate(data, { abortEarly: false });
    return { isValid: true, data: validatedData, errors: null };
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.message;
    });
    return { isValid: false, data: null, errors };
  }
};

// Custom validators
export const customValidators = {
  isValidDateRange: (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
  },

  isValidAmount: (amount) => {
    return !isNaN(amount) && parseFloat(amount) > 0;
  },

  isValidAgentCode: (code) => {
    return patterns.agentCode.test(code);
  },

  isValidTicketNumber: (number) => {
    return patterns.ticketNumber.test(number);
  },

  isValidCurrency: (currency) => {
    return patterns.currency.test(currency);
  },
};

export default {
  patterns,
  validators,
  schemas,
  validateField,
  validateForm,
  customValidators,
};