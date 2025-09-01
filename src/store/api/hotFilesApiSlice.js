// src/store/api/hotFilesApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with common configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  prepareHeaders: (headers, { getState }) => {
    // Add any auth headers here if needed
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Enhanced base query with error handling
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  if (result.error) {
    // Handle different error types
    if (result.error.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (result.error.status === 'FETCH_ERROR') {
      // Handle network errors
      console.error('Network error:', result.error.error);
    }
  }
  
  return result;
};

export const hotFilesApiSlice = createApi({
  reducerPath: 'hotFilesApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    'Dashboard',
    'Transaction',
    'Office',
    'Passenger',
    'Analytics',
    'File',
    'Search',
    'Health',
  ],
  endpoints: (builder) => ({
    // Dashboard Endpoints
    getExecutiveDashboard: builder.query({
      query: (params) => ({
        url: '/api/dashboard/executive',
        params,
      }),
      providesTags: ['Dashboard'],
    }),

    getOfficeDashboard: builder.query({
      query: ({ agentCode, ...params }) => ({
        url: `/api/dashboard/office/${agentCode}`,
        params,
      }),
      providesTags: (result, error, { agentCode }) => [
        { type: 'Dashboard', id: agentCode },
      ],
    }),

    // Transaction Endpoints
    getTransactions: builder.query({
      query: (params) => ({
        url: '/api/transactions',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ transactionNumber }) => ({
                type: 'Transaction',
                id: transactionNumber,
              })),
              { type: 'Transaction', id: 'LIST' },
            ]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),

    getTransactionDetails: builder.query({
      query: (transactionNumber) => `/api/transactions/${transactionNumber}`,
      providesTags: (result, error, transactionNumber) => [
        { type: 'Transaction', id: transactionNumber },
      ],
    }),

    getTicketDetails: builder.query({
      query: (ticketNumber) => `/api/tickets/${ticketNumber}`,
      providesTags: (result, error, ticketNumber) => [
        { type: 'Transaction', id: ticketNumber },
      ],
    }),

    // Office Endpoints
    getAllOffices: builder.query({
      query: (params) => ({
        url: '/api/offices',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ agentCode }) => ({
                type: 'Office',
                id: agentCode,
              })),
              { type: 'Office', id: 'LIST' },
            ]
          : [{ type: 'Office', id: 'LIST' }],
    }),

    getOfficeDetails: builder.query({
      query: (agentCode) => `/api/offices/${agentCode}`,
      providesTags: (result, error, agentCode) => [
        { type: 'Office', id: agentCode },
      ],
    }),

    // Passenger Endpoints
    getPassengers: builder.query({
      query: (params) => ({
        url: '/api/passengers',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Passenger',
                id,
              })),
              { type: 'Passenger', id: 'LIST' },
            ]
          : [{ type: 'Passenger', id: 'LIST' }],
    }),

    getPassengerHistory: builder.query({
      query: (transactionNumber) => `/api/passengers/${transactionNumber}/history`,
      providesTags: (result, error, transactionNumber) => [
        { type: 'Passenger', id: transactionNumber },
      ],
    }),

    // Analytics Endpoints
    getRevenueAnalytics: builder.query({
      query: (params) => ({
        url: '/api/analytics/revenue',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    getCommissionAnalytics: builder.query({
      query: (params) => ({
        url: '/api/analytics/commission',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    getPerformanceMetrics: builder.query({
      query: (params) => ({
        url: '/api/analytics/performance',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    getTravelPatterns: builder.query({
      query: (params) => ({
        url: '/api/analytics/travel-patterns',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Travel Routes
    getRouteAnalytics: builder.query({
      query: (params) => ({
        url: '/api/travel/routes',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // File Management Endpoints
    uploadHot22File: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/upload-hot22',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['File', 'Dashboard', 'Analytics'],
    }),

    getFileStats: builder.query({
      query: () => '/stats',
      providesTags: ['File'],
    }),

    getRecords: builder.query({
      query: ({ type, ...params }) => ({
        url: `/records/${type}`,
        params,
      }),
      providesTags: ['File'],
    }),

    deleteAllRecords: builder.mutation({
      query: () => ({
        url: '/records/all',
        method: 'DELETE',
      }),
      invalidatesTags: ['File', 'Dashboard', 'Analytics', 'Transaction', 'Office', 'Passenger'],
    }),

    // Search Endpoints
    globalSearch: builder.query({
      query: (params) => ({
        url: '/api/search',
        params,
      }),
      providesTags: ['Search'],
    }),

    quickLookup: builder.query({
      query: ({ type, value }) => `/api/lookup/${type}/${value}`,
      providesTags: ['Search'],
    }),

    // Reports Endpoints
    getFileSummary: builder.query({
      query: (params) => ({
        url: '/api/reports/files',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    exportTransactions: builder.query({
      query: (params) => ({
        url: '/api/reports/export/transactions',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Utility Endpoints
    getDistinctValues: builder.query({
      query: ({ field, ...params }) => ({
        url: `/api/utils/distinct/${field}`,
        params,
      }),
      providesTags: ['Analytics'],
    }),

    getCollectionHealth: builder.query({
      query: () => '/api/health/collections',
      providesTags: ['Health'],
    }),

    // Health Check
    checkHealth: builder.query({
      query: () => '/health',
      providesTags: ['Health'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Dashboard
  useGetExecutiveDashboardQuery,
  useGetOfficeDashboardQuery,

  // Transactions
  useGetTransactionsQuery,
  useGetTransactionDetailsQuery,
  useGetTicketDetailsQuery,

  // Offices
  useGetAllOfficesQuery,
  useGetOfficeDetailsQuery,

  // Passengers
  useGetPassengersQuery,
  useGetPassengerHistoryQuery,

  // Analytics
  useGetRevenueAnalyticsQuery,
  useGetCommissionAnalyticsQuery,
  useGetPerformanceMetricsQuery,
  useGetTravelPatternsQuery,
  useGetRouteAnalyticsQuery,

  // Files
  useUploadHot22FileMutation,
  useGetFileStatsQuery,
  useGetRecordsQuery,
  useDeleteAllRecordsMutation,

  // Search
  useGlobalSearchQuery,
  useQuickLookupQuery,

  // Reports
  useGetFileSummaryQuery,
  useExportTransactionsQuery,

  // Utilities
  useGetDistinctValuesQuery,
  useGetCollectionHealthQuery,
  useCheckHealthQuery,

  // Manual trigger functions (for lazy queries)
  useLazyGetTransactionsQuery,
  useLazyGlobalSearchQuery,
  useLazyGetRevenueAnalyticsQuery,
} = hotFilesApiSlice;