// src/services/hotFilesApi.js - Updated to include error logs services
import { apiClient } from './api';

// Dashboard API Services
export const dashboardApi = {
  getExecutiveDashboard: (params) =>
    apiClient.get('/api/dashboard/executive', { params }),

  getOfficeDashboard: (agentCode, params) =>
    apiClient.get(`/api/dashboard/office/${agentCode}`, { params }),
};

// Office API Services
export const officeApi = {
  getAllOffices: (params) => apiClient.get('/api/offices', { params }),

  getOfficeDetails: (agentCode) => apiClient.get(`/api/offices/${agentCode}`),
};

// Transaction API Services
export const transactionApi = {
  getTransactions: (params) => apiClient.get('/api/transactions', { params }),

  getTransactionDetails: (transactionNumber) =>
    apiClient.get(`/api/transactions/${transactionNumber}`),

  getTicketDetails: (ticketNumber) =>
    apiClient.get(`/api/tickets/${ticketNumber}`),
};

// Analytics API Services
export const analyticsApi = {
  getRevenueAnalytics: (params) =>
    apiClient.get('/api/analytics/revenue', { params }),

  getCommissionAnalytics: (params) =>
    apiClient.get('/api/analytics/commission', { params }),

  getPerformanceMetrics: (params) =>
    apiClient.get('/api/analytics/performance', { params }),

  getTravelPatterns: (params) =>
    apiClient.get('/api/analytics/travel-patterns', { params }),
};

// Customer API Services
export const customerApi = {
  getPassengers: (params) => apiClient.get('/api/passengers', { params }),

  getPassengerHistory: (transactionNumber) =>
    apiClient.get(`/api/passengers/${transactionNumber}/history`),
};

// Travel API Services
export const travelApi = {
  getRouteAnalytics: (params) =>
    apiClient.get('/api/travel/routes', { params }),
};

// Reports API Services
export const reportsApi = {
  getFileSummary: (params) => apiClient.get('/api/reports/files', { params }),

  exportTransactions: (params) =>
    apiClient.get('/api/reports/export/transactions', { params }),

  downloadTransactionsCsv: (params, filename = 'transactions.csv') =>
    apiClient.downloadFile(
      '/api/reports/export/transactions?format=csv',
      filename
    ),
};

// Search API Services
export const searchApi = {
  globalSearch: (params) => apiClient.get('/api/search', { params }),

  quickLookup: (type, value) => apiClient.get(`/api/lookup/${type}/${value}`),
};

// File API Services
export const fileApi = {
  uploadHot22File: (file, onProgress) =>
    apiClient.uploadFile('/upload-hot22', file, onProgress),

  getStats: () => apiClient.get('/stats'),

  getRecords: (type, params) => apiClient.get(`/records/${type}`, { params }),

  deleteAllRecords: () => apiClient.delete('/records/all'),
};

// Health API Services
export const healthApi = {
  checkHealth: () => apiClient.get('/health'),

  getCollectionHealth: () => apiClient.get('/api/health/collections'),
};

// Utility API Services
export const utilityApi = {
  getDistinctValues: (field, params) =>
    apiClient.get(`/api/utils/distinct/${field}`, { params }),
};

// Error Logs API Services
export const errorLogsApi = {
  // Get error logs with advanced filtering
  getErrorLogs: (params) => apiClient.get('/api/error-logs', { params }),

  // Get specific upload log details
  getErrorLogDetails: (uploadId) =>
    apiClient.get(`/api/error-logs/${uploadId}`),

  // Get error statistics
  getErrorStats: (params) =>
    apiClient.get('/api/error-logs/stats/summary', { params }),

  // Export error logs
  exportErrorLogs: (params) =>
    apiClient.get('/api/error-logs/export', { params }),

  // Download error logs file
  downloadErrorLogs: (params, filename) =>
    apiClient.downloadFile('/api/error-logs/export', filename, { params }),

  // Get error logs by record type
  getErrorLogsByType: (recordType, params) =>
    apiClient.get(`/api/error-logs/by-type/${recordType}`, { params }),

  // Search error logs
  searchErrorLogs: (params) =>
    apiClient.get('/api/error-logs/search', { params }),

  // Get dashboard summary
  getDashboardSummary: (params) =>
    apiClient.get('/api/error-logs/dashboard', { params }),

  // Get real-time monitoring data
  getRealtimeMonitoring: (params) =>
    apiClient.get('/api/error-logs/monitor/realtime', { params }),

  // Cleanup old error logs (Admin)
  cleanupErrorLogs: (params) =>
    apiClient.delete('/api/error-logs/cleanup', { params }),

  // Bulk operations on error logs
  bulkOperationErrorLogs: (body) =>
    apiClient.post('/api/error-logs/bulk', body),

  // Bulk delete error logs
  bulkDeleteErrorLogs: (uploadIds) =>
    apiClient.post('/api/error-logs/bulk', {
      uploadIds,
      operation: 'delete',
    }),

  // Bulk export error logs
  bulkExportErrorLogs: (uploadIds) =>
    apiClient.post('/api/error-logs/bulk', {
      uploadIds,
      operation: 'export',
    }),
};

// Combined API object for easy import
export const hotFilesApi = {
  dashboard: dashboardApi,
  office: officeApi,
  transaction: transactionApi,
  analytics: analyticsApi,
  customer: customerApi,
  travel: travelApi,
  reports: reportsApi,
  search: searchApi,
  utility: utilityApi,
  file: fileApi,
  health: healthApi,
  errorLogs: errorLogsApi,
};

export default hotFilesApi;
