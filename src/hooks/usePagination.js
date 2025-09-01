// src/hooks/usePagination.js
import { useState, useMemo, useCallback } from 'react';

const usePagination = ({
  totalItems = 0,
  itemsPerPage = 10,
  initialPage = 1,
  maxPageNumbers = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  // Calculate pagination values
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    
    // Calculate page numbers to display
    const getPageNumbers = () => {
      const pages = [];
      const half = Math.floor(maxPageNumbers / 2);
      
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxPageNumbers - 1);
      
      // Adjust start if we're near the end
      if (end - start + 1 < maxPageNumbers) {
        start = Math.max(1, end - maxPageNumbers + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    };

    return {
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      startIndex,
      endIndex,
      hasNextPage,
      hasPreviousPage,
      pageNumbers: getPageNumbers(),
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
      itemsOnCurrentPage: Math.min(pageSize, totalItems - startIndex),
    };
  }, [currentPage, pageSize, totalItems, maxPageNumbers]);

  // Navigation functions
  const goToPage = useCallback((page) => {
    const { totalPages } = paginationData;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [paginationData]);

  const goToNextPage = useCallback(() => {
    if (paginationData.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationData.hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationData.hasPreviousPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(paginationData.totalPages);
  }, [paginationData.totalPages]);

  // Page size functions
  const changePageSize = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    // Adjust current page to maintain roughly the same position
    const currentStartIndex = (currentPage - 1) * pageSize;
    const newPage = Math.floor(currentStartIndex / newPageSize) + 1;
    setCurrentPage(newPage);
  }, [currentPage, pageSize]);

  // Reset pagination
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(itemsPerPage);
  }, [initialPage, itemsPerPage]);

  // Get items for current page (for client-side pagination)
  const getPaginatedItems = useCallback((items) => {
    const { startIndex, endIndex } = paginationData;
    return items.slice(startIndex, endIndex);
  }, [paginationData]);

  // Get pagination info text
  const getPaginationText = useCallback(() => {
    const { startIndex, endIndex, totalItems } = paginationData;
    
    if (totalItems === 0) {
      return 'No items to display';
    }
    
    return `Showing ${startIndex + 1}-${endIndex} of ${totalItems} items`;
  }, [paginationData]);

  return {
    // Data
    ...paginationData,
    
    // Navigation
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    
    // Page size
    changePageSize,
    
    // Utilities
    reset,
    getPaginatedItems,
    getPaginationText,
  };
};

export default usePagination;