import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import ContentWrapper from 'components/ui/custom/ContentWrapper';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { createColumnHelper } from '@tanstack/react-table';
import AffiliatesService from 'services/affiliates.services';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { DashboardCard } from 'components/custom/DashboardCard';
import { dummyCards, getDateInUTCToTimeZone } from 'helpers/functions';
import { BoldCell, DateCell, IdCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { Button, Input } from 'components/ui';

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor((row) => row.campaignStats.CampaignID, {
    id: 'CampaignID',
    header: 'Campaign ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CampaignName, {
    id: 'CampaignName',
    header: 'Campaign Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CampaignLink, {
    id: 'CampaignLink',
    header: 'Campaign Link',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => getDateInUTCToTimeZone(row.DateCreated), {
    id: 'DateCreated',
    header: 'Created At',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.campaignStats?.Hits ? row.campaignStats?.Hits : '0'), {
    id: 'Hits',
    header: 'Hits',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor(
    (row) => (row.campaignStats?.ReferredUsers ? row.campaignStats?.ReferredUsers : '0'),
    {
      id: 'ReferredUsers',
      header: 'Referred Users',
      cell: BoldCell,
      enableSorting: false
    }
  ),
  columnHelper.accessor(
    (row) => (row.campaignStats?.FirstTimeDeposits ? row.campaignStats?.FirstTimeDeposits : '0'),
    {
      id: 'FirstTimeDeposits',
      header: 'First Time Deposits',
      cell: BoldCell,
      enableSorting: false
    }
  ),
  columnHelper.accessor(
    (row) => (row.campaignStats?.TotalDeposits ? row.campaignStats?.TotalDeposits : '0'),
    {
      id: 'TotalDeposits',
      header: 'Total Deposits',
      cell: BoldCell,
      enableSorting: false
    }
  ),
  columnHelper.accessor(
    (row) => (row.campaignStats?.OverallCommission ? row.campaignStats?.OverallCommission : '0'),
    {
      id: 'OverallCommission',
      header: 'Overall Commission',
      cell: BoldCell,
      enableSorting: false
    }
  )
];

export default function AffiliateDetails() {
  const { t } = useTranslation();
  const { affiliateId } = useParams();
  const [summary, setSummary] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const fetchData = async ({ pageIndex, pageSize, keyword: q }) => {
    const res = await AffiliatesService.getAffiliateDetail({
      affiliateId,
      pagination: { pageIndex, pageSize },
      filters: { keyword: q || '' }
    });
    if (res.status === 200) {
      const apiData = res.response?.data || {};
      // Handle both shapes: data at root or nested under data
      const payload = apiData?.data ? apiData.data : apiData;
      const campaigns = Array.isArray(payload?.Camapgns) ? payload.Camapgns : [];
      setSummary(payload?.Summary || null);
      const totalRecords = apiData?.totalRecords ?? res.response?.totalRecords ?? campaigns.length;
      return { status: 200, data: campaigns, totalRecords };
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
      columnPinning: { left: ['CampaignID'] },
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

  const pageTitle = `${t('affiliates')} ${t('details')}`;
  const breadcrumbItem = [{ title: t('affiliates'), path: '/affiliates' }, { title: t('details') }];

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('affiliates') + ' ' + t('details')}
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
            label={t('affiliate_uid', { defaultValue: 'Affiliate UID' })}
            value={`${summary?.AffiliateUID ?? '-'}`}
            gradientFrom={dummyCards.Affiliate.AFFILIATE_UID.gradientFrom}
            gradientTo={dummyCards.Affiliate.AFFILIATE_UID.gradientTo}
            textColor="text-sky-100"
            maskShape="is-reuleaux-triangle"
          />
          <DashboardCard
            label={t('user_id', { defaultValue: 'User ID' })}
            value={`${summary?.UserID ?? '-'}`}
            gradientFrom={dummyCards.Affiliate.USER_ID.gradientFrom}
            gradientTo={dummyCards.Affiliate.USER_ID.gradientTo}
            textColor="text-amber-50"
            maskShape="is-diamond"
          />
          <DashboardCard
            label={t('hits', { defaultValue: 'Hits' })}
            value={`${summary?.Hits ?? 0}`}
            gradientFrom={dummyCards.Affiliate.HITS.gradientFrom}
            gradientTo={dummyCards.Affiliate.HITS.gradientTo}
            textColor="text-pink-100"
            maskShape="is-hexagon-2"
          />
          <DashboardCard
            label={t('referred_users', { defaultValue: 'Referred Users' })}
            value={`${summary?.ReferredUsers ?? 0}`}
            gradientFrom={dummyCards.Affiliate.REFERRED_USERS.gradientFrom}
            gradientTo={dummyCards.Affiliate.REFERRED_USERS.gradientTo}
            textColor="text-sky-100"
            maskShape="is-reuleaux-triangle"
          />
          <DashboardCard
            label={t('first_time_deposits', { defaultValue: 'First Time Deposits' })}
            value={`${summary?.FirstTimeDeposits ?? 0}`}
            gradientFrom={dummyCards.Affiliate.FIRST_TIME_DEPOSITS.gradientFrom}
            gradientTo={dummyCards.Affiliate.FIRST_TIME_DEPOSITS.gradientTo}
            textColor="text-amber-50"
            maskShape="is-diamond"
          />
          <DashboardCard
            label={t('total_deposits', { defaultValue: 'Total Deposits' })}
            value={`${summary?.TotalDeposits ?? 0}`}
            gradientFrom={dummyCards.Affiliate.TOTAL_DEPOSITS.gradientFrom}
            gradientTo={dummyCards.Affiliate.TOTAL_DEPOSITS.gradientTo}
            textColor="text-pink-100"
            maskShape="is-hexagon-2"
          />
          <DashboardCard
            label={t('overall_commission', { defaultValue: 'Overall Commission' })}
            value={`${summary?.OverallCommission ?? 0}`}
            gradientFrom={dummyCards.Affiliate.TOTAL_COMMISSION.gradientFrom}
            gradientTo={dummyCards.Affiliate.TOTAL_COMMISSION.gradientTo}
            textColor="text-sky-100"
            maskShape="is-reuleaux-triangle"
          />
        </div>
      )}
      <div className="flex items-center gap-2 px-[--margin-x] pt-4">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchParams(
                (prev) => ({
                  ...Object.fromEntries(prev),
                  keyword: keyword.trim(),
                  pageIndex: 0
                }),
                { replace: true }
              );
            }
          }}
          classNames={{ input: 'h-8 text-xs ring-primary-500/50 focus:ring', root: 'shrink-0' }}
          placeholder={t('search') + ' ' + t('campaign_name') + ', ' + t('campaign_link') + '...'}
        />
        <Button
          onClick={() =>
            setSearchParams(
              (prev) => ({
                ...Object.fromEntries(prev),
                keyword: keyword.trim(),
                pageIndex: 0
              }),
              { replace: true }
            )
          }
          className="h-8 whitespace-nowrap px-2.5 text-xs">
          {t('search')}
        </Button>
        <Button
          onClick={() => {
            setKeyword('');
            setSearchParams(
              (prev) => {
                const next = { ...Object.fromEntries(prev), pageIndex: 0 };
                delete next.keyword;
                return next;
              },
              { replace: true }
            );
          }}
          className="h-8 whitespace-nowrap px-2.5 text-xs"
          disabled={!keyword && !(searchParams.get('keyword') || '')}>
          {t('reset') + ' ' + t('filter')}
        </Button>
      </div>
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
