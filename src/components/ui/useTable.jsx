import { useEffect, useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import useDeepCompareEffect from 'use-deep-compare-effect';

const useTable = ({ columns, fetchData, queryParams, setSearchParams, initialSettings = {} }) => {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize pagination from URL or default values
  const [pagination, setPagination] = useState({
    pageIndex: isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex,
    pageSize: isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize,
    totalCount: 0
  });

  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(initialSettings.columnVisibility || {});
  const [columnPinning, setColumnPinning] = useState(initialSettings.columnPinning || {});

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
    ...initialSettings.tableSettings
  });

  // Fetch data from API with pagination + queryParams
  const fetchTableData = async (loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    try {
      const result = await fetchData({
        ...queryParams, // Keep existing filters from URL
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize
      });

      if (result.status === 200) {
        setResponse(result.data);
        setPagination((prev) => ({
          ...prev,
          totalCount: result.totalRecords || 0
        }));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }

    if (loading) {
      setIsLoading(false);
    }
  };

  // Re-fetch data when pagination or queryParams change
  useDeepCompareEffect(() => {
    fetchTableData();
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;

    setPagination({
      ...pagination,
      pageIndex,
      pageSize
    });
  }, [queryParams]);

  //   Sync pagination with URL
  useEffect(() => {
    setSearchParams(
      (prevParams) => ({
        ...Object.fromEntries(prevParams), // Preserve existing query params
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize
      }),
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);

  const table = useReactTable({
    data: response,
    columns,
    manualPagination: true,
    rowCount: pagination.totalCount,
    manualFiltering: true,
    state: {
      columnFilters,
      pagination,
      columnVisibility,
      columnPinning,
      tableSettings
    },
    meta: {
      deleteRow: async () => {
        await fetchTableData(false);
      },
      changeStatus: async () => {
        await fetchTableData(false);
      },
      editRow: async () => {
        await fetchTableData(false);
      },
      fetchNewList: async (value) => {
        await fetchTableData(value);
      },
      setTableSettings
    },
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters
  });

  return {
    table,
    isLoading,
    error,
    setError,
    setPagination,
    setColumnFilters,
    tableSettings,
    setTableSettings
  };
};

export default useTable;
