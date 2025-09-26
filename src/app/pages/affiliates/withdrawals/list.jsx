import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';
import { Toolbar } from './Toolbar';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import AffiliatesService from 'services/affiliates.services';
import { affiliatesWithdrawalsListResponseMapper } from '../helper';

export default function Withdrawals() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { affiliateId } = useParams();
  const pageTitle = t('withdrawals');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchApiLogs = async () => {
    // setError(null);
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await AffiliatesService.getWithdrawals({
      pagination: { pageIndex, pageSize },
      filters: { ...queryParams, affiliateUID: affiliateId }
    });

    if (result.status === 200) {
      console.log(result);
      const mapped = affiliatesWithdrawalsListResponseMapper(result.response);
      return {
        status: 200,
        data: mapped.list,
        totalRecords: parseInt(mapped.totalRecords, 10) || mapped.list.length || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchApiLogs,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['transactionID'], right: ['actions'] },
      tableSettings: {},
      columnVisibility: { firstname: false }
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useLockScrollbar(tableSettings.enableFullScreen);

  // Sync URL query params -> table filters
  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) filtersFromQuery.push({ id: 'username', value: queryParams.keyword });
    if (queryParams.txnStatus)
      filtersFromQuery.push({
        id: 'transactionStatus',
        value: (queryParams.txnStatus || '').toString().toLowerCase()
      });
    if (queryParams.currencyCode)
      filtersFromQuery.push({ id: 'currencyCode', value: queryParams.currencyCode });
    if (queryParams.startDate && queryParams.endDate)
      filtersFromQuery.push({
        id: 'createdAt',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'username') filterItems.keyword = data.value;
      if (data.id === 'transactionStatus') filterItems.txnStatus = data.value;
      if (data.id === 'currencyCode') filterItems.currencyCode = data.value;
      if (data.id === 'createdAt') filterItems.date = data.value;
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.txnStatus && { txnStatus: filterItems.txnStatus }),
      ...(filterItems.currencyCode && { currencyCode: filterItems.currencyCode }),
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
