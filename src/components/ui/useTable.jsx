import { useEffect, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

const useTable = ({ columns, fetchData, queryParams, setSearchParams }) => {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  console.log('isNaN(queryParams.pageIndex): ', isNaN(queryParams.pageIndex));
  

  // Initialize pagination from URL or default values
  const [pagination, setPagination] = useState({
    pageIndex: isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex,
    pageSize: isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize,
    totalCount: 0,
  });

  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnPinning, setColumnPinning] = useState({
    left: ["id"],
    right: ["actions"],
  });

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

  // Fetch data from API with pagination + queryParams
  const fetchTableData = async () => {
    setIsLoading(true);
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
          totalCount: result.totalRecords || 0,
        }));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  // Re-fetch data when pagination or queryParams change
  useEffect(() => {
    console.log('queryParams change', queryParams);
    
    fetchTableData();

    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;

    setPagination({
        ...pagination,
        pageIndex,
        pageSize,
      });

      const filtersFromQuery = [];

      if (queryParams.keyword) {
        filtersFromQuery.push({ id: "username", value: queryParams.keyword });
      }
      if (queryParams.status) {
        filtersFromQuery.push({ id: "status", value: queryParams.status });
      }
      if (queryParams.startDate && queryParams.endDate) {
        filtersFromQuery.push({
          id: "createdAt",
          value: [+queryParams.startDate, +queryParams.endDate],
        });
      }

      setColumnFilters(filtersFromQuery);
  }, [queryParams]);

    //   Sync pagination with URL
  useEffect(() => {
    setSearchParams((prevParams) => ({
      ...Object.fromEntries(prevParams), // Preserve existing query params
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    }));
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
      tableSettings,
    },
    meta: {
      deleteRow: async () => {
        await fetchTableData();
      },
      setTableSettings,
    },
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters,
  });

  return {
    table,
    isLoading,
    error,
    setError,
    setPagination,
    setColumnFilters,
    tableSettings,
    setTableSettings,
  };
};

export default useTable;
