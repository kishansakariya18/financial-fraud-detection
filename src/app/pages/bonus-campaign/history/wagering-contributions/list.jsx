import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { columns } from './columns.jsx';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import BonusCampaignService from 'services/bonus-campaign.services';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { getDateInUTCToTimeZone } from 'helpers/functions.js';

export default function WageringContributions() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('wagering') + ' ' + t('contributions');
  const { grantId } = useParams();

  const breadcrumbs = [
    { title: t('bonusCampaign'), path: '/bonus-campaign' },
    { title: t('bonusGrants'), path: -1 },
    { title: t('wagering') + ' ' + t('contributions') }
  ];

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchWageringContributions = async () => {
    try {
      const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
      const pageSize = isNaN(queryParams.pageSize)
        ? DEFAULT_PER_PAGE_RECORD
        : +queryParams.pageSize;

      const result = await BonusCampaignService.getWageringContributions({
        pagination: { pageIndex, pageSize },
        grantId: grantId
      });

      console.log('result:', result);

      if (result.status === 200) {
        const apiData = result?.response?.data || [];
        const totalRecords = parseInt(result.response?.totalRecords) || 0;

        for (let data of apiData) {
          data.DateCreated = getDateInUTCToTimeZone(data.DateCreated);
        }

        return {
          status: 200,
          data: apiData,
          totalRecords: totalRecords
        };
      }

      return {
        status: result.status,
        error: result.error || 'Failed to fetch wagering contributions'
      };
    } catch (error) {
      console.error('Error in fetchWageringContributions:', error);
      return {
        status: 500,
        error: error?.message || 'An error occurred while fetching data'
      };
    }
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData: fetchWageringContributions,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['ContributionID'] },
      tableSettings: { enableFullScreen: false },
      columnVisibility: {}
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper
      pageTitle={pageTitle}
      title={pageTitle}
      enableFullScreen={tableSettings.enableFullScreen}>
      <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
        <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
          {pageTitle}
        </h2>
        <div className="hidden self-stretch py-1 sm:flex">
          <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
        </div>
        <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
      </div>

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
