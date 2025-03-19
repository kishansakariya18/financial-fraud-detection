// Import Dependencies
import {
  flexRender,
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
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useThemeContext } from "app/contexts/theme/context";
import AdminService from "../../../../services/admin.services";
import { responseMapper } from "./helper";
import { useSearchParams } from "react-router";
import { getQueryParams, isEmptyObject } from "utils/custom.utilities";
import { toast } from "sonner";
// import { Button } from "@headlessui/react";
// import { PlusIcon } from "@heroicons/react/24/outline";

// ----------------------------------------------------------------------

export default function Admin() {
  const { cardSkin } = useThemeContext();

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

  useEffect(() => {
    if(!isLoading && error){
      toast.error(error);
      setError('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

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

  return (
    
    <Page title="Admins">
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
            <Card
              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden",
              )}
            >
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table
                  hoverable
                  dense={tableSettings.enableRowDense}
                  sticky={tableSettings.enableFullScreen}
                  className="w-full text-left rtl:text-right"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className={clsx(
                              "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 ltr:first:rounded-tl-lg ltr:last:rounded-tr-lg rtl:first:rounded-tr-lg rtl:last:rounded-tl-lg",
                              header.column.getCanPin() && [
                                header.column.getIsPinned() === "left" &&
                                  "sticky z-2 ltr:left-0 rtl:right-0",
                                header.column.getIsPinned() === "right" &&
                                  "sticky z-2 ltr:right-0 rtl:left-0",
                              ],
                            )}
                          >
                            {header.column.getCanSort() ? (
                              <div
                                className="flex cursor-pointer select-none items-center space-x-3 rtl:space-x-reverse"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <span className="flex-1">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                      )}
                                </span>
                                <TableSortIcon
                                  sorted={header.column.getIsSorted()}
                                />
                              </div>
                            ) : header.isPlaceholder ? null : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )
                            )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <Tr
                          key={row.id}
                          className={clsx(
                            "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                            row.getIsSelected() &&
                              "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500",
                          )}
                        >
                          {/* first row is a normal row */}
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <Td
                                key={cell.id}
                                className={clsx(
                                  "relative bg-white",
                                  cardSkin === "shadow"
                                    ? "dark:bg-dark-700"
                                    : "dark:bg-dark-900",
                                  cell.column.getCanPin() && [
                                    cell.column.getIsPinned() === "left" &&
                                      "sticky z-2 ltr:left-0 rtl:right-0",
                                    cell.column.getIsPinned() === "right" &&
                                      "sticky z-2 ltr:right-0 rtl:left-0",
                                  ],
                                )}
                              >
                                {cell.column.getIsPinned() && (
                                  <div
                                    className={clsx(
                                      "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                                      cell.column.getIsPinned() === "left"
                                        ? "ltr:border-r rtl:border-l"
                                        : "ltr:border-l rtl:border-r",
                                    )}
                                  ></div>
                                )}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })}
                  </TBody>
                </Table>
              </div>
              <SelectedRowsActions table={table} />
              {table.getCoreRowModel().rows.length && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings.enableFullScreen &&
                      "bg-gray-50 dark:bg-dark-800",
                    !(
                      table.getIsSomeRowsSelected() ||
                      table.getIsAllRowsSelected()
                    ) && "pt-4",
                  )}
                >
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
