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
  getAllOffices: (params) => 
    apiClient.get('/api/offices', { params }),
  
  getOfficeDetails: (agentCode) => 
    apiClient.get(`/api/offices/${agentCode}`),
};

// Transaction API Services
export const transactionApi = {
  getTransactions: (params) => 
    apiClient.get('/api/transactions', { params }),
  
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
  getPassengers: (params) => 
    apiClient.get('/api/passengers', { params }),
  
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
  getFileSummary: (params) => 
    apiClient.get('/api/reports/files', { params }),
  
  exportTransactions: (params) => 
    apiClient.get('/api/reports/export/transactions', { params }),
  
  downloadTransactionsCsv: (params, filename = 'transactions.csv') => 
    apiClient.downloadFile('/api/reports/export/transactions?format=csv', filename),
};

// Search API Services
export const searchApi = {
  globalSearch: (params) => 
    apiClient.get('/api/search', { params }),
  
  quickLookup: (type, value) => 
    apiClient.get(`/api/lookup/${type}/${value}`),
};

// Utility API Services
export const utilityApi = {
  getDistinctValues: (field, params) => 
    apiClient.get(`/api/utils/distinct/${field}`, { params }),
  
  getCollectionHealth: () => 
    apiClient.get('/api/health/collections'),
};

// File Upload API Services
export const fileApi = {
  uploadHot22File: (file, onProgress) => 
    apiClient.uploadFile('/upload-hot22', file, onProgress),
  
  getStats: () => 
    apiClient.get('/stats'),
  
  getRecords: (type, params) => 
    apiClient.get(`/records/${type}`, { params }),
  
  deleteAllRecords: () => 
    apiClient.delete('/records/all'),
};

// Health Check API Services
export const healthApi = {
  checkHealth: () => 
    apiClient.get('/health'),
  
  getCollectionHealth: () => 
    utilityApi.getCollectionHealth(),
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
};

export default hotFilesApi;