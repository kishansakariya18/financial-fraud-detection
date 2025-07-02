import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI,Services,Helper,Utils
import { RateLimitRuleFilters } from './RateLimitRuleFilters';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { responseMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import RateLimitRuleService from 'services/rate-limit-rules.services';

export default function RateLimitRules() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('rate_limit_rules');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchRateLimitRules = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await RateLimitRuleService.getRateLimitRulesList({
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

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchRateLimitRules,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['rateLimitID'], right: ['actions'] },
      tableSettings: {},
      columnVisibility: { rateLimitUID: false }
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
      filtersFromQuery.push({ id: 'label', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'isActive', value: queryParams.status });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'label') {
        filterItems.keyword = data.value;
      }

      if (data.id === 'isActive') {
        filterItems.status = data.value;
      }
    }

    setSearchParams({
      ...queryParams,
      pageIndex: 0,
      pageSize: 10,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status })
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
      <RateLimitRuleFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
