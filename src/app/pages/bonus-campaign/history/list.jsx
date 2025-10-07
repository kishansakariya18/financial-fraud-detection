import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

// import { RiCashFill } from 'react-icons/ri';
import BonusCampaignService from 'services/bonus-campaign.services';
// import { discountTypeToAPP, bonusGrantResponseMapper, segmentationTypeToAPP } from '../helper';
// import { Button, Card, Skeleton } from 'components/ui';
// import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
// import { Toolbar } from './Toolbar';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import {} from // BanknotesIcon,
// DocumentDuplicateIcon
// PresentationChartBarIcon,
// UsersIcon
'@heroicons/react/20/solid';
import { bonusGrantResponseMapper } from '../helper';
// import { Toolbar } from './Toolbar';

export default function BonusGrants() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  // const [cardData, setCardData] = useState();
  const pageTitle = t('bonusGrants');
  // const { copied, copy } = useClipboard({ timeout: 2000 });
  const { bonusCampaignId } = useParams();

  const breadcrumbs = [
    { title: t('bonusCampaign'), path: '/bonus-campaign' },
    { title: t('bonusGrants') }
  ];

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchBonusGrants = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await BonusCampaignService.getBonusGrants({
      pagination: { pageIndex, pageSize },
      bonusCampaignId: bonusCampaignId
    });

    console.log('result.response.data:', result?.response?.data);

    const apiData = bonusGrantResponseMapper(result?.response?.data || []);

    // const recordsCount = parseInt(result.response.totalRecords, 10) || 0;
    // const uniqueUsers = parseInt(result.response.uniqueUsers, 10) || 0;
    // const depositAmount = parseInt(result.response.depositAmount, 10) || 0;
    // const benefitAmount = parseInt(result.response.benefitAmount, 10) || 0;

    if (result.status === 200) {
      // setCardData({
      //   recordsCount,
      //   uniqueUsers,
      //   depositAmount,
      //   benefitAmount
      // });
      return {
        status: 200,
        data: apiData,
        totalRecords: parseInt(result.response?.totalRecords)
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData: fetchBonusGrants,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { enableFullScreen: false },
      columnVisibility: {}
    }
  });

  useEffect(() => {}, [bonusCampaignId]);

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
      {/* <div className="mt-4 grid grid-cols-2 gap-3 px-[--margin-x] sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 2xl:gap-6">
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="truncate text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardData?.recordsCount}
            </p>
            <PresentationChartBarIcon className="size-8" />
          </div>
          <p className="mt-1 truncate text-xs+">{t('record') + ' ' + t('count')}</p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="truncate text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardData?.uniqueUsers}
            </p>
            <UsersIcon className="size-8" />
          </div>
          <p className="mt-1 truncate text-xs+">{t('unique') + ' ' + t('user')}</p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="truncate text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardData?.depositAmount}
            </p>
            <BanknotesIcon className="size-8" />
          </div>
          <p className="mt-1 truncate text-xs+">{t('deposit') + ' ' + t('amount')}</p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="truncate text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardData?.benefitAmount}
            </p>
            <RiCashFill className="size-8" />
          </div>
          <p className="mt-1 truncate text-xs+">{t('benefit') + ' ' + t('amount')}</p>
        </div>
      </div> */}

      {/* <Toolbar
        table={table}
        pageTitle={t('bonusGrants')}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      /> */}

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
