// Import Dependencies
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

// Local Imports
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import AdminService from "../../../../services/admin.services";
import { responseMapper } from "./helper";
import { useSearchParams } from "react-router";
import { getQueryParams, isEmptyObject } from "utils/custom.utilities";
import TableCard from "components/ui/custom/TableCard";

// ----------------------------------------------------------------------

export default function Admin() {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

  const queryParams = useMemo(
    () => getQueryParams(searchParams),
    [searchParams],
  );

  const [columnVisibility, setColumnVisibility] = useState({
    firstname: false,
    lastname: false,
  });

  const [columnPinning, setColumnPinning] = useState({
    left: ["id"],
    right: ["actions"],
  });

  const fetchAdmin = async () => {
    setIsLoading(true);
    // setError(null);
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await AdminService.getAllAdmin({
      pagination: { pageIndex, pageSize },
      filters: queryParams,
    });

    if (result.status === 200) {
      const apiData = result.response.data;
      const recordsCount = parseInt(result.response.total_records, 10) || 0;
      const resultData = responseMapper(apiData);
      setResponse(resultData);

      setPagination((prev) => ({
        ...prev,
        totalCount: recordsCount,
      }));
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAdmin();

    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;

    setSearchParams({ ...queryParams, pageIndex, pageSize });

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

    setPagination({
      ...pagination,
      pageIndex,
      pageSize,
    });

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  useEffect(() => {
    setSearchParams({
      ...queryParams,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);

  const table = useReactTable({
    data: response,
    columns: columns,
    manualPagination: true,
    rowCount: pagination.totalCount,
    manualFiltering: true,
    state: {
      columnFilters,
      pagination,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      deleteRow: async () => {
        await fetchAdmin();
      },
      setTableSettings,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters,

    // autoResetPageIndex,
  });

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of columnFilters) {
      if (data.id === "username") {
        filterItems.keyword = data.value;
      }

      if (data.id === "status") {
        filterItems.status = data.value;
      }

      if (data.id === "createdAt") {
        filterItems.date = data.value;
      }
    }

    delete queryParams.pageIndex;
    delete queryParams.pageSize;

    setSearchParams({
      ...queryParams,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] }),
    });
  };

  useDidUpdate(() => table.resetRowSelection(), [response]);

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams();
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);
  console.log(isLoading);
  console.log(error);

  return (
    <Page title="Orders Datatable v1">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900",
          )}
        >
          <Toolbar
            table={table}
            onApplyFilters={applyFilterHandler}
            onClearFilters={clearFilterHandler}
          />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-[--margin-x]",
            )}
          >
            <TableCard 
            tableSettings={tableSettings}
            table={table}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
