import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import CountryService from 'services/country.services';
import { getQueryParams } from 'utils/custom.utilities';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
// import { Page } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import { BlockedProvidersFilters } from './BlockedProvidersFilters';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { useLockScrollbar } from 'hooks';
// import { useLockScrollbar } from 'hooks';

export default function BlockedProvidersList(props) {
  const params = useParams();
  const countryId = props.countryId || params.countryId;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const pageTitle = t('blockedProviders');
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchBlockedProviders = async () => {
    setIsLoading(true);
    try {
      const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
      const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
      const filters = {
        keyword: queryParams.keyword || '',
        globallyBlocked:
          queryParams.globallyBlocked === '' || queryParams.globallyBlocked == null
            ? null
            : queryParams.globallyBlocked === 'true' || queryParams.globallyBlocked === true
      };
      const result = await CountryService.getCountryBlockedProviders(
        { pageIndex, pageSize },
        filters,
        countryId
      );
      setIsLoading(false);
      console.log('Blocked Providers API result:', result);
      if (result.status === 200) {
        return {
          status: 200,
          data: result.response?.data || [],
          totalRecords:
            parseInt(result.response?.totalRecords, 10) || result.response?.data?.length || 0,
          totalPages: result.response?.totalPages || 1
        };
      }
      return { status: result.status, error: result.error };
    } catch {
      setError('Failed to fetch blocked providers');
      setIsLoading(false);
      return { status: 500, error: 'Failed to fetch blocked providers' };
    }
  };

  const { table, tableSettings } = useTable({
    columns,
    fetchData: fetchBlockedProviders,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {}
    },
    meta: { countryId, fetchBlockedProviders }
  });

  const breadcrumbItem = [
    { title: t('countries'), path: '/site-configuration/country' },
    { title: t('blockedProviders') }
  ];

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [error]);

  useEffect(() => {
    const newFilters = [];
    if (queryParams.keyword) {
      newFilters.push({ id: 'providerName', value: queryParams.keyword });
    }
    if (queryParams.globallyBlocked === 'true') {
      newFilters.push({ id: 'isBlocked', value: 'blocked' });
    } else if (queryParams.globallyBlocked === 'false') {
      newFilters.push({ id: 'isBlocked', value: 'active' });
    }
    table.setColumnFilters(newFilters);
    // eslint-disable-next-line
  }, [queryParams]);

  const handleApplyFilters = () => {
    const filters = table.getState().columnFilters;
    const params = {};
    filters.forEach((f) => {
      if (f.id === 'providerName') params.keyword = f.value;
      if (f.id === 'isBlocked') {
        if (f.value === 'blocked') params.globallyBlocked = 'true';
        else if (f.value === 'active') params.globallyBlocked = 'false';
        else params.globallyBlocked = '';
      }
    });
    setSearchParams({
      ...queryParams,
      ...params,
      pageIndex: 0
    });
  };

  const handleClearFilters = () => {
    table.setColumnFilters([]);
    setSearchParams({
      ...queryParams,
      keyword: '',
      globallyBlocked: '',
      pageIndex: 0
    });
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <div className="flex items-center space-x-4 px-[--margin-x] py-5 lg:py-6 rtl:space-x-reverse">
        <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          {pageTitle}
        </h2>
        <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
      </div>
      <BlockedProvidersFilters
        table={table}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        pageTitle={pageTitle}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
