import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import AffiliatesService from 'services/affiliates.services';
import { columns } from './columns';
import { Toolbar } from './Toolbar';

export default function AffiliateUsersList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const { affiliateId } = useParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const pageTitle = t('referred_users');

  const fetchData = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const result = await AffiliatesService.getReferrals({
      affiliateId,
      pagination: { pageIndex, pageSize },
      filters: { keyword: queryParams.keyword || '' }
    });

    if (result.status === 200) {
      const payload = result.response;
      const list = Array.isArray(payload?.data) ? payload.data : [];
      const totalRecords = parseInt(payload?.totalRecords, 10) || list.length || 0;
      return { status: 200, data: list, totalRecords };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['UserID'] },
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

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        keyword={keyword}
        setKeyword={setKeyword}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        pageTitle={pageTitle}
        table={table}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
