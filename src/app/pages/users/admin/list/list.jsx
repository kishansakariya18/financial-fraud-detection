import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { useLockScrollbar } from "hooks";

// Local Imports - UI,Services,Helper,Utils
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import TableCard from "components/ui/custom/TableCard";
import ContentWrapper from "components/ui/custom/ContentWrapper";

import AdminService from "../../../../../services/admin.services";

import { responseMapper } from "../helper";
import { getQueryParams, isEmptyObject } from "utils/custom.utilities";
import { useTranslation } from "react-i18next";

import useTable from "components/ui/useTable";

export default function Admin() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t("admins")

  const queryParams = useMemo(
    () => getQueryParams(searchParams),
    [searchParams],
  );
  
  const fetchAdmin = async () => {
    // setError(null);
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await AdminService.getAllAdmin({
      pagination: { pageIndex, pageSize },
      filters: queryParams,
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: responseMapper(result.response.data),
        totalRecords: parseInt(result.response.total_records, 10) || 0,
      };
    }

    return { status: result.status, error: result.error };
  };

  const {
    table,
    isLoading,
    error,
    setError,
    tableSettings,
  } = useTable({ columns, fetchData: fetchAdmin, queryParams, setSearchParams });

  useEffect(() => {
    if(!isLoading && error){
      toast.error(error);
      setError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
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

    setSearchParams({
      ...queryParams,
      pageIndex: 0,
      pageSize: 10,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] }),
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({
        pageIndex: 0,
      pageSize: 10,
    });
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
