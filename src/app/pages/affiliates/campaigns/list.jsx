import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import ContentWrapper from 'components/ui/custom/ContentWrapper';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import AffiliatesService from 'services/affiliates.services';
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

  const pageTitle = `${t('affiliates') + ' ' + t('details')}`;

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
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
