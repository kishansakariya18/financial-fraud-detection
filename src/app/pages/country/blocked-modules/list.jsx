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
import ContentWrapper from 'components/ui/custom/ContentWrapper';

export default function BlockedModulesList(props) {
  const params = useParams();
  const countryId = props.countryId || params.countryId;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const pageTitle = t('blockedModules');
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchBlockedModules = async () => {
    setIsLoading(true);
    try {
      const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
      const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
      const filters = {
        keyword: queryParams.keyword || '',
        globallyBlocked: queryParams.globallyBlocked ?? null
      };
      const result = await CountryService.getCountryBlockedModules(
        { pageIndex, pageSize },
        filters,
        countryId
      );
      setIsLoading(false);
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
      setError('Failed to fetch blocked modules');
      setIsLoading(false);
      return { status: 500, error: 'Failed to fetch blocked modules' };
    }
  };

  const { table, tableSettings } = useTable({
    columns,
    fetchData: fetchBlockedModules,
    fetchSummary: fetchBlockedModules,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {}
    },
    meta: { countryId, fetchBlockedModules }
  });

  const breadcrumbItem = [
    { title: t('countries'), path: '/site-configuration/country' },
    { title: t('blockedModules') }
  ];

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [error]);

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
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
