import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import PlayerService from 'services/users.services';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { Toolbar } from './Toolbar';

export default function TransactionsList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('transactions');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchTransactions = useCallback(async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const result = await PlayerService.getAllUserTransactionList({
      currentPage: pageIndex + 1,
      perPage: pageSize,
      filters: {
        keyword: queryParams.keyword || undefined,
        startDate: queryParams.startDate || undefined,
        endDate: queryParams.endDate || undefined,
        transactionType: queryParams.transactionType || undefined
      }
    });

    console.log('result: ', result);

    if (result.status === 200) {
      const response = result.response;
      return {
        status: 200,
        data: response,
        totalRecords: response.totalRecords || 0
      };
    }
    return { status: result.status, error: result.error };
  }, [queryParams]);

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchTransactions,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {}
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
      filtersFromQuery.push({ id: 'userId', value: queryParams.keyword });
    }
    if (queryParams.fraudStatus) {
      filtersFromQuery.push({ id: 'fraudStatus', value: queryParams.fraudStatus });
    }
    if (queryParams.type) {
      filtersFromQuery.push({ id: 'type', value: queryParams.type });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'transactionDate',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }
    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'userId') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'fraudStatus') {
        filterItems.fraudStatus = data.value;
      }
      if (data.id === 'type') {
        filterItems.type = data.value;
      }
      if (data.id === 'transactionDate') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.fraudStatus && { fraudStatus: filterItems.fraudStatus }),
      ...(filterItems.type && { type: filterItems.type }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  const breadcrumbItem = [{ title: t('transactions') }];

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        table={table}
        pageTitle={pageTitle}
        breadcrumbs={breadcrumbItem}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
