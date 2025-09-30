// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import AffiliatesService from 'services/affiliates.services';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { columns } from './referred-users/columns';
import { Toolbar as ReferredUsersToolbar } from './referred-users/Toolbar';
import { DashboardCard } from 'components/custom/DashboardCard';
import { dummyCards } from 'helpers/functions';

export function ViewDetails() {
  const { t } = useTranslation();
  const { campaignUID } = useParams();
  const [summary, setSummary] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const pageTitle = t('campaign') + ' ' + t('details');
  const { affiliateId } = useParams();

  const fetchData = async ({ pageIndex, pageSize, keyword: q }) => {
    const res = await AffiliatesService.getCampaignDetail({
      campaignUID,
      pagination: { pageIndex, pageSize },
      filters: { keyword: q || '' }
    });
    if (res.status === 200) {
      const apiData = res.response?.data || {};
      const payload = apiData?.data ? apiData.data : apiData;
      const users = Array.isArray(payload?.users) ? payload.users : [];
      setSummary(payload?.summary || null);
      const totalRecords = apiData?.totalRecords ?? res.response?.totalRecords ?? users.length;
      return { status: 200, data: users, totalRecords };
    }
    return { status: res.status, error: res.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData,
    queryParams: useMemo(
      () => ({
        pageIndex: searchParams.get('pageIndex'),
        pageSize: searchParams.get('pageSize'),
        keyword: searchParams.get('keyword') || ''
      }),
      [searchParams]
    ),
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['ReferredUserID'] },
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
  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliates' },
    { title: t('campaign') + ' ' + t('list'), path: `/affiliates/${affiliateId}/tab/campaigns` },
    { title: t('campaign') + ' ' + t('details') }
  ];

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x]">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-4 px-[--margin-x] sm:grid-cols-3">
          <DashboardCard
            label={t('campaign_name', { defaultValue: 'Campaign Name' })}
            value={`${summary?.CampaignName ?? '-'}`}
            gradientFrom={dummyCards.Affiliate.AFFILIATE_UID.gradientFrom}
            gradientTo={dummyCards.Affiliate.AFFILIATE_UID.gradientTo}
            textColor="text-sky-100"
            maskShape="is-reuleaux-triangle"
          />
          <DashboardCard
            label={t('campaign_code', { defaultValue: 'Campaign Code' })}
            value={`${summary?.CampaignCode ?? '-'}`}
            gradientFrom={dummyCards.Affiliate.USER_ID.gradientFrom}
            gradientTo={dummyCards.Affiliate.USER_ID.gradientTo}
            textColor="text-amber-50"
            maskShape="is-diamond"
          />
          <DashboardCard
            label={t('hits', { defaultValue: 'Hits' })}
            value={`${summary?.campaignStats?.Hits ?? 0}`}
            gradientFrom={dummyCards.Affiliate.HITS.gradientFrom}
            gradientTo={dummyCards.Affiliate.HITS.gradientTo}
            textColor="text-pink-100"
            maskShape="is-hexagon-2"
          />
          <DashboardCard
            label={t('referred_users', { defaultValue: 'Referred Users' })}
            value={`${summary?.campaignStats?.ReferredUsers ?? 0}`}
            gradientFrom={dummyCards.Affiliate.REFERRED_USERS.gradientFrom}
            gradientTo={dummyCards.Affiliate.REFERRED_USERS.gradientTo}
            textColor="text-sky-100"
            maskShape="is-reuleaux-triangle"
          />
          <DashboardCard
            label={t('first_time_deposits', { defaultValue: 'First Time Deposits' })}
            value={`${summary?.campaignStats?.FirstTimeDeposits ?? 0}`}
            gradientFrom={dummyCards.Affiliate.FIRST_TIME_DEPOSITS.gradientFrom}
            gradientTo={dummyCards.Affiliate.FIRST_TIME_DEPOSITS.gradientTo}
            textColor="text-amber-50"
            maskShape="is-diamond"
          />
          <DashboardCard
            label={t('total_deposits', { defaultValue: 'Total Deposits' })}
            value={`${summary?.campaignStats?.TotalDeposits ?? 0}`}
            gradientFrom={dummyCards.Affiliate.TOTAL_DEPOSITS.gradientFrom}
            gradientTo={dummyCards.Affiliate.TOTAL_DEPOSITS.gradientTo}
            textColor="text-pink-100"
            maskShape="is-hexagon-2"
          />
          <DashboardCard
            label={t('overall_commission', { defaultValue: 'Overall Commission' })}
            value={`${summary?.campaignStats?.OverallCommission ?? 0}`}
            gradientFrom={dummyCards.Affiliate.TOTAL_COMMISSION.gradientFrom}
            gradientTo={dummyCards.Affiliate.TOTAL_COMMISSION.gradientTo}
            textColor="text-sky-100"
            maskShape="is-reuleaux-triangle"
          />
        </div>
      )}

      <ReferredUsersToolbar
        pageTitle={t('referred_users', { defaultValue: 'Referred Users' })}
        keyword={keyword}
        setKeyword={setKeyword}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        table={table}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}

export default ViewDetails;
