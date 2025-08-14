import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from './redux';
import { addNotification } from '../store/slices/uiSlice';

/**
 * Custom hook for API calls with loading, error, and success states
 */
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        dispatch(
          addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, dispatch]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

/**
 * Hook for automatic API calls on mount or dependency changes
 */
export const useApiEffect = (apiFunction, dependencies = [], options = {}) => {
  const { skip = false, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (skip) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction();
        setData(response.data);
        onSuccess?.(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        onError?.(err);
        dispatch(
          addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

/**
 * Hook for paginated API calls
 */
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRecords: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const dispatch = useAppDispatch();

  const fetchData = useCallback(
    async (newParams = {}) => {
      try {
        setLoading(true);
        setError(null);
        const mergedParams = { ...params, ...newParams };
        const response = await apiFunction(mergedParams);
        setData(response.data.data);
        setPagination(response.data.pagination);
        setParams(mergedParams);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        dispatch(
          addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, params, dispatch]
  );

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      fetchData({ page: pagination.currentPage + 1 });
    }
  }, [fetchData, pagination]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      fetchData({ page: pagination.currentPage - 1 });
    }
  }, [fetchData, pagination]);

  const goToPage = useCallback(
    (page) => {
      fetchData({ page });
    },
    [fetchData]
  );

  const setPageSize = useCallback(
    (limit) => {
      fetchData({ page: 1, limit });
    },
    [fetchData]
  );

  const updateParams = useCallback(
    (newParams) => {
      fetchData({ ...newParams, page: 1 });
    },
    [fetchData]
  );

  const reset = useCallback(() => {
    setData([]);
    setPagination({
      currentPage: 1,
      totalPages: 0,
      totalRecords: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 50,
    });
    setError(null);
    setParams(initialParams);
  }, [initialParams]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    params,
    fetchData,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
    updateParams,
    reset,
  };
};

export default useApi;
