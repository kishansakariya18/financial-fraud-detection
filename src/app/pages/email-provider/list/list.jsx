import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';
import { Toolbar } from './Toolbar';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import EmailProviderService from '../../../../services/email-provider.services';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { emailProviderResponseMapper } from '../helper';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

export default function EmailProvider() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('emailProvider');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { hasPermission } = usePermissions();
  const canShowActions =
    hasPermission(PERMISSIONS.EMAIL_PROVIDER.EDIT) ||
    hasPermission(PERMISSIONS.EMAIL_PROVIDER.CHANGE_STATUS) ||
    hasPermission(PERMISSIONS.EMAIL_PROVIDER.DELETE);

  const fetchEmailProviders = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await EmailProviderService.emailProviderList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: emailProviderResponseMapper(result.response.data),
        totalRecords: parseInt(result.response.total_record, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns({ canShowActions }),
    fetchData: fetchEmailProviders,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: canShowActions ? ['actions'] : [] },
      tableSettings: {},
      columnVisibility: {}
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, isLoading, setError]);

  useEffect(() => {
    const filtersFromQuery = [];
    console.log('queryParams::', queryParams);

    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'providerName', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }
    console.log('filtersFromQuery:::', filtersFromQuery);
    setColumnFilters(filtersFromQuery);
  }, [queryParams, setColumnFilters]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'providerName') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
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
      setSearchParams({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PER_PAGE_RECORD
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
