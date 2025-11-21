import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI,Services,Helper,Utils
import { CurrencyFilters } from './currencyFilters';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD, PERMISSIONS } from 'constants/app.constant';
import CurrencyService from 'services/currency.services';
import { currencyListResponseMapper } from '../helper';
import usePermissions from 'app/router/usePermissions';

export default function Currency() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('currency');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { hasPermission } = usePermissions();
  const canShowActions =
    hasPermission(PERMISSIONS.CURRENCY.STATUS) ||
    hasPermission(PERMISSIONS.CURRENCY.EDIT) ||
    hasPermission(PERMISSIONS.CURRENCY.EXCHANGE_RATE_HISTORY) ||
    hasPermission(PERMISSIONS.CURRENCY.EXCHANGE_RATE_EDIT) ||
    hasPermission(PERMISSIONS.CURRENCY.EXCHANGE_UPDATE_TYPE);
  // const fetchSummary = async () => {
  //   // setError(null);

  //   const result = await CurrencyService.getCurrencySummary();

  //   if (result.status === 200) {
  //     setSummary(result.response.data);
  //     return {
  //       status: 200,
  //       data: result.response.data,
  //       totalRecords: parseInt(result.response.total_records, 10) || 0
  //     };
  //   }

  //   return { status: result.status, error: result.error };
  // };
  // useEffect(() => {
  //   fetchSummary();
  // }, []);
  const fetchCurrencies = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await CurrencyService.getCurrencyList({
      filters: queryParams,
      pagination: { pageIndex, pageSize }
    });

    const apiData = currencyListResponseMapper(result.response);

    if (result.status === 200) {
      return {
        status: 200,
        data: apiData.list,
        totalRecords: parseInt(apiData.total_records, 10) || apiData.list?.length || 0,
        totalPages: apiData.total_pages || 1
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns({ canShowActions }),
    fetchData: fetchCurrencies,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['ID'], right: canShowActions ? ['Actions'] : [] },
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
      filtersFromQuery.push({ id: 'Name', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'Status', value: queryParams.status });
    }
    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    // console.log('table.getState().columnFilters:', table.getState().columnFilters);

    for (let data of table.getState().columnFilters) {
      if (data.id === 'Name') {
        if (data.value) {
          filterItems.keyword = data.value;
        }
      } else if (data.id === 'Status') {
        if (data.value) {
          filterItems.status = data.value;
        }
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);
  // console.log('tableSettings: from reports', table);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      {/* <Toolbar breadcrumbs={breadcrumbs} table={table} pageTitle={pageTitle} /> */}
      <CurrencyFilters
        pageTitle={pageTitle}
        table={table}
        // summary={summary}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
