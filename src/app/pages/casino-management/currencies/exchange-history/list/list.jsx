import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import CurrencyService from 'services/currency.services';
import { exchangeHistoryListResponseMapper } from './helper';

export default function ExchangeHistoryList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('exchange_history');
  const { currencyCode } = useParams();
  console.log('Currency Code:', currencyCode);

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  // const fetchExchangeHistory = async () => {
  //   const response = await CurrencyService.getExchangeRateHistory(currencyCode, {
  //     page: 1,
  //     per_page: queryParams.pageSize,
  //     search: queryParams.keyword
  //   });
  //   console.log('API Response:', response);
  //   return exchangeHistoryListResponseMapper(response);
  //   if (result.status === 200) {
  //     return {
  //       status: 200,
  //       data: apiData.list,
  //       totalRecords: parseInt(apiData.total_records, 10) || apiData.list?.length || 0,
  //       totalPages: apiData.total_pages || 1
  //     };
  //   }
  //   return { status: result.status, error: result.error };
  // };
  const fetchExchangeHistory = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 1 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await CurrencyService.getExchangeRateHistory(currencyCode, {
      filters: queryParams,
      pagination: { pageIndex, pageSize }
    });

    const apiData = exchangeHistoryListResponseMapper(result.response);

    if (result.status === 200) {
      return {
        status: 200,
        data: apiData.list,
        totalRecords: parseInt(apiData.totalRecords, 10) || apiData.list?.length || 0,
        totalPages: apiData.totalPages || 1
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchExchangeHistory,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { right: ['actions'] },
      tableSettings: { enableFullScreen: false }
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
      filtersFromQuery.push({ id: 'Base Currency', value: queryParams.keyword });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'Base Currency') {
        filterItems.keyword = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        table={table}
        pageTitle={pageTitle}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
