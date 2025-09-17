// src/store/api/errorLogsApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with common configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Enhanced base query with error handling
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error.status === 401) {
      console.error('Unauthorized access');
    } else if (result.error.status === 'FETCH_ERROR') {
      console.error('Network error:', result.error.error);
    }
  }

  return result;
};

export const errorLogsApiSlice = createApi({
  reducerPath: 'errorLogsApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['ErrorLog', 'ErrorStats', 'ErrorDashboard'],
  endpoints: (builder) => ({
    // Get Error Logs with Advanced Filtering
    getErrorLogs: builder.query({
      query: (params) => ({
        url: '/api/error-logs',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ uploadId }) => ({
                type: 'ErrorLog',
                id: uploadId,
              })),
              { type: 'ErrorLog', id: 'LIST' },
            ]
          : [{ type: 'ErrorLog', id: 'LIST' }],
    }),

    // Get Specific Upload Log Details
    getErrorLogDetails: builder.query({
      query: (uploadId) => `/api/error-logs/${uploadId}`,
      providesTags: (result, error, uploadId) => [
        { type: 'ErrorLog', id: uploadId },
      ],
    }),

    // Get Error Statistics
    getErrorStats: builder.query({
      query: (params = {}) => ({
        url: '/api/error-logs/stats/summary',
        params,
      }),
      providesTags: ['ErrorStats'],
    }),

    // Export Error Logs
    exportErrorLogs: builder.query({
      query: (params) => ({
        url: '/api/error-logs/export',
        params,
      }),
      providesTags: ['ErrorLog'],
    }),

    // Get Error Logs by Record Type
    getErrorLogsByType: builder.query({
      query: ({ recordType, ...params }) => ({
        url: `/api/error-logs/by-type/${recordType}`,
        params,
      }),
      providesTags: (result, error, { recordType }) => [
        { type: 'ErrorLog', id: `TYPE_${recordType}` },
      ],
    }),

    // Search Error Logs
    searchErrorLogs: builder.query({
      query: (params) => ({
        url: '/api/error-logs/search',
        params,
      }),
      providesTags: ['ErrorLog'],
    }),

    // Dashboard Summary
    getErrorLogsDashboard: builder.query({
      query: (params = {}) => ({
        url: '/api/error-logs/dashboard',
        params,
      }),
      providesTags: ['ErrorDashboard'],
    }),

    // Real-time Monitoring
    getRealtimeMonitoring: builder.query({
      query: (params = {}) => ({
        url: '/api/error-logs/monitor/realtime',
        params,
      }),
      providesTags: ['ErrorStats'],
    }),

    // Cleanup Old Error Logs (Admin)
    cleanupErrorLogs: builder.mutation({
      query: (params) => ({
        url: '/api/error-logs/cleanup',
        method: 'DELETE',
        params,
      }),
      invalidatesTags: ['ErrorLog', 'ErrorStats', 'ErrorDashboard'],
    }),

    // Bulk Operations on Error Logs
    bulkOperationErrorLogs: builder.mutation({
      query: (body) => ({
        url: '/api/error-logs/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ErrorLog', 'ErrorStats', 'ErrorDashboard'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetErrorLogsQuery,
  useGetErrorLogDetailsQuery,
  useGetErrorStatsQuery,
  useExportErrorLogsQuery,
  useGetErrorLogsByTypeQuery,
  useSearchErrorLogsQuery,
  useGetErrorLogsDashboardQuery,
  useGetRealtimeMonitoringQuery,
  useCleanupErrorLogsMutation,
  useBulkOperationErrorLogsMutation,

  // Lazy queries
  useLazyGetErrorLogsQuery,
  useLazySearchErrorLogsQuery,
  useLazyExportErrorLogsQuery,
} = errorLogsApiSlice;
