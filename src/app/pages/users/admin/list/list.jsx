// Import Dependencies
import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { useLockScrollbar, useDidUpdate } from "hooks";

// Local Imports - UI,Services,Helper,Utils
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import TableCard from "components/ui/custom/TableCard";
import ContentWrapper from "components/ui/custom/ContentWrapper";

import AdminService from "../../../../../services/admin.services";

import { responseMapper } from "../helper";
import { getQueryParams, isEmptyObject } from "utils/custom.utilities";
import { useTranslation } from "react-i18next";


// ----------------------------------------------------------------------

export default function Admin() {
  const { t } = useTranslation()
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t("admins")

  const queryParams = useMemo(
    () => getQueryParams(searchParams),
    [searchParams],
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const [columnFilters, setColumnFilters] = useState([]);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

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
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
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
  console.log(isLoading);
  console.log(error);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} />
    </ContentWrapper>
  );
}
