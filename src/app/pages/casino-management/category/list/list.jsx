import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI,Services,Helper,Utils
import { CategoryFilters } from './categoryFilters';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { responseMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import BankService from 'services/bank.services';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

export default function Banks() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('casino_category');
  const [summary, setSummary] = useState(null);
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchBanks = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await BankService.getBankList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: responseMapper(result.response.data),
        totalRecords: parseInt(result.response.totalRecords, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };
  const fetchSummary = async () => {
    // setError(null);

    const result = await CategoryService.getCategorySummary();

    if (result.status === 200) {
      setSummary(result.response.data);
      return {
        status: 200,
        data: result.response.data,
        totalRecords: parseInt(result.response.total_records, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };
  useEffect(() => {
    fetchSummary();
  }, []);
  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchSummary: fetchSummary,
    fetchData: fetchCategory,
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
      filtersFromQuery.push({ id: 'name', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }

    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'createdAt',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }
    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    // console.log('table.getState().columnFilters:', table.getState().columnFilters);

    for (let data of table.getState().columnFilters) {
      if (data.id === 'name') {
        filterItems.keyword = data.value;
      }

      if (data.id === 'status') {
        filterItems.status = data.value;
      }

      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] })
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
  // console.log('tableSettings: from reports', table);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      {/* <Toolbar breadcrumbs={breadcrumbs} table={table} pageTitle={pageTitle} /> */}
      <CategoryFilters
        pageTitle={pageTitle}
        table={table}
        summary={summary}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        // filters= {}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
