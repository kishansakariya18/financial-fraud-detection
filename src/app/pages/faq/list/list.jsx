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
import FaqService from 'services/faq.services';
import { responseMapper } from '../helper';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

export default function FaqList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('faq') + ' ' + t('list');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { hasPermission } = usePermissions();
  const canShowActions =
    hasPermission(PERMISSIONS.FAQ.EDIT) || hasPermission(PERMISSIONS.FAQ.DELETE);

  const fetchFaqs = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await FaqService.list({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result?.status === 200) {
      const resp = result.response || {};
      const list = responseMapper(resp.data || resp.Data || resp.list || resp.List || []);
      const totalRecords =
        parseInt(resp.totalRecords || resp.total_record || resp.TotalRecords || list.length, 10) ||
        DEFAULT_PER_PAGE_RECORD;
      return { status: 200, data: list, totalRecords };
    }
    return { status: result?.status || 500, error: result?.error || 'Failed to load FAQ' };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns({ canShowActions }),
    fetchData: fetchFaqs,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: canShowActions ? ['actions'] : [] },
      tableSettings: {},
      columnVisibility: { answer: false }
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
      filtersFromQuery.push({ id: 'question', value: queryParams.keyword });
    }
    if (queryParams.faqStatus) {
      const v = Number(queryParams.faqStatus);
      const statusVal = !isNaN(v) ? (v === 1 ? 'active' : 'inactive') : queryParams.faqStatus;
      filtersFromQuery.push({ id: 'status', value: statusVal });
    }
    if (queryParams.module) {
      filtersFromQuery.push({ id: 'module', value: queryParams.module });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'question') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.faqStatus =
          data.value === 'active' ? '1' : data.value === 'inactive' ? '0' : data.value;
      }
      if (data.id === 'module') {
        filterItems.module = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.faqStatus !== undefined &&
        filterItems.faqStatus !== '' && {
          faqStatus: filterItems.faqStatus
        }),
      ...(filterItems.module && { module: filterItems.module })
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
