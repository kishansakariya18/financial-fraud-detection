import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import ContentWrapper from 'components/ui/custom/ContentWrapper';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import AffiliatesService from 'services/affiliates.services';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { columns } from './columns';
import { Toolbar as CampaignsToolbar } from './Toolbar';

export default function AffiliateDetails() {
  const { t } = useTranslation();
  const { affiliateId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const fetchData = async ({ pageIndex, pageSize, keyword: q }) => {
    const res = await AffiliatesService.getCampaignList({
      affiliateId,
      pagination: { pageIndex, pageSize },
      filters: { keyword: q || '' }
    });
    if (res.status === 200) {
      const apiData = res.response?.data || {};
      // Handle both shapes: data at root or nested under data
      const payload = apiData?.data ? apiData.data : apiData;
      const campaigns = Array.isArray(payload?.Camapgns) ? payload.Camapgns : [];
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
      columnPinning: { left: ['CampaignID'], right: ['actions'] },
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
  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliates' },
    { title: t('affiliate') + ' ' + t('details') }
  ];

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x]">
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
      <CampaignsToolbar
        pageTitle={t('campaign') + ' ' + t('list')}
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
