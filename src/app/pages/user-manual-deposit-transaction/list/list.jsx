import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI,Services,Helper,Utils
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { Toolbar } from './Toolbar';

import { responseMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import UserManualDepositTransactionService from 'services/user-manual-deposit-transaction.services';
import { parsePayoutStatusToAPI } from '../helper';

export default function UserManualDepositTransaction() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('user_manual_deposit_transaction');
  const [refetch, setRefetch] = useState(false);

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchUserManualDepositTransaction = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    console.log(queryParams);
    const result = await UserManualDepositTransactionService.getUserManualDepositTransactionList({
      pagination: { pageIndex, pageSize },
      keyword: queryParams.keyword,
      status: parsePayoutStatusToAPI(queryParams.status)
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: responseMapper(result.response.data),
        totalRecords: parseInt(result.response.total_record, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchUserManualDepositTransaction,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {}
    },
    meta: {
      refetchData: () => {
        setRefetch((prev) => !prev);
      }
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'keyword', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  useEffect(() => {
    if (refetch) {
      table.options.meta?.refetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'keyword') {
        filterItems.keyword = data.value;
      }

      if (data.id === 'depositStatus') {
        filterItems.depositStatus = data.value;
      }
    }

    setSearchParams({
      ...queryParams,
      pageIndex: 0,
      pageSize: 10,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.depositStatus && { status: filterItems.depositStatus })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({
        pageIndex: 0,
        pageSize: 10
      });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
