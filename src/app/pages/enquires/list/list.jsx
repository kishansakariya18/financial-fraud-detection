import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
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
import EnquiresService from 'services/enquires.service';
import { listResponseMapper } from '../helper';

export default function EnquiresList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('enquires') + ' ' + t('list');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchEnquires = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await EnquiresService.list({
      filters: queryParams,
      pagination: { pageIndex, pageSize }
    });

    if (result?.status === 200) {
      const mapped = listResponseMapper(result.response);
      return {
        status: 200,
        data: mapped,
        totalRecords:
          parseInt(result.response?.total_records, 10) || result.response?.data?.length || 0,
        totalPages: result.response?.total_pages || 1
      };
    }
    return { status: result?.status, error: result?.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchEnquires,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['ID'], right: ['action'] },
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
    if (queryParams.setBy) {
      filtersFromQuery.push({ id: 'Set By', value: queryParams.setBy });
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
    for (let data of table.getState().columnFilters) {
      if (data.id === 'Name') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'Status') {
        filterItems.status = data.value;
      }
      if (data.id === 'Set By') {
        filterItems.setBy = data.value;
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
      ...(filterItems.setBy && { setBy: filterItems.setBy }),
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
