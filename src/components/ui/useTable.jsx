import { useEffect, useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import useDeepCompareEffect from 'use-deep-compare-effect';

const useTable = ({
  columns,
  fetchData,
  queryParams = {},
  setSearchParams = null,
  initialSettings = {},
  paginationEnabled = true // ✅ optional prop
}) => {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [pagination, setPagination] = useState({
    pageIndex: +queryParams.pageIndex || 0,
    pageSize: +queryParams.pageSize || 10,
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

  const fetchTableData = async (loading = true) => {
    if (loading) setIsLoading(true);
    try {
      const params = paginationEnabled
        ? {
            ...queryParams,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize
          }
        : queryParams;

      const result = await fetchData(params);

      if (result.status === 200) {
        setResponse(result.data);
        if (paginationEnabled) {
          setPagination((prev) => ({
            ...prev,
            totalCount: result.totalRecords || result.data?.length || 0
          }));
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }

    if (loading) setIsLoading(false);
  };

  useDeepCompareEffect(() => {
    fetchTableData();

    if (
      paginationEnabled &&
      (queryParams.pageIndex !== undefined || queryParams.pageSize !== undefined)
    ) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: +queryParams.pageIndex || 0,
        pageSize: +queryParams.pageSize || 10
      }));
    }
  }, [queryParams]);

  // ✅ Update URL only if pagination is enabled
  useEffect(() => {
    if (!paginationEnabled || typeof setSearchParams !== 'function') return;

    setSearchParams(
      (prevParams) => ({
        ...Object.fromEntries(prevParams),
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize
      }),
      { replace: true }
    );
  }, [pagination.pageIndex, pagination.pageSize, setSearchParams, paginationEnabled]);

  const table = useReactTable({
    data: response,
    columns,
    ...(paginationEnabled
      ? {
          manualPagination: true,
          rowCount: pagination.totalCount,
          state: {
            pagination,
            columnFilters,
            columnVisibility,
            columnPinning,
            tableSettings
          },
          onPaginationChange: setPagination
        }
      : {
          manualPagination: false,
          state: {
            columnFilters,
            columnVisibility,
            columnPinning,
            tableSettings
          }
        }),
    manualFiltering: true,
    meta: {
      deleteRow: async () => await fetchTableData(false),
      changeStatus: async () => await fetchTableData(false),
      editRow: async () => await fetchTableData(false),
      fetchNewList: async (value) => await fetchTableData(value),
      setTableSettings
    },
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning
  });

  return {
    table,
    isLoading,
    error,
    setError,
    ...(paginationEnabled && {
      setPagination
    }),
    setColumnFilters,
    tableSettings,
    setTableSettings
  };
};

export default useTable;
