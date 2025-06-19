import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams, useParams } from 'react-router';
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
import { userclassLimitListResponseMapper } from '../helper';
import UserClassService from 'services/user-class.services';

export default function UserClassLimitsList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userClassUID } = useParams();
  const pageTitle = t('userClass') + ' ' + t('limits') + ' ' + t('list');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchUserClassLimits = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    // TODO: Replace with actual API call to fetch user class limits
    const result = await UserClassService.userClassLimitList({
      filters: queryParams,
      pagination: { pageIndex, pageSize }
    });

    const apiData = userclassLimitListResponseMapper(result.response);

    if (result.status === 200) {
      return {
        status: 200,
        data: apiData.list,
        totalRecords: parseInt(result?.response?.totalRecords) || DEFAULT_PER_PAGE_RECORD
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchUserClassLimits,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { enableFullScreen: false },
      columnVisibility: { slug: false }
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
    if (queryParams.limitType) {
      filtersFromQuery.push({ id: 'limitType', value: queryParams.limitType });
    }
    if (queryParams.limitPeriod) {
      filtersFromQuery.push({ id: 'limitPeriod', value: queryParams.limitPeriod });
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
      if (data.id === 'limitType') {
        filterItems.limitType = data.value;
      }
      if (data.id === 'limitPeriod') {
        filterItems.limitPeriod = data.value;
      }
      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.limitType && { limitType: filterItems.limitType }),
      ...(filterItems.limitPeriod && { limitPeriod: filterItems.limitPeriod }),
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
        userClassUID={userClassUID}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
