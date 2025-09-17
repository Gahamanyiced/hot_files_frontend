// src/services/errorLogsApi.js
import { apiClient } from './api';

// Error Logs API Services
export const errorLogsApi = {
  // Get error logs with advanced filtering
  getErrorLogs: (params) => 
    apiClient.get('/api/error-logs', { params }),
  
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
      operation: 'delete'
    }),
  
  // Bulk export error logs
  bulkExportErrorLogs: (uploadIds) => 
    apiClient.post('/api/error-logs/bulk', {
      uploadIds,
      operation: 'export'
    }),
};

// Add to main hotFilesApi.js exports
export { errorLogsApi };