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
import { Toolbar } from './Toolbar';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import AffiliateService from 'services/affiliate.services';
import { loginHistoryResponseMapper } from '../helper';

export default function LoginHistoryList() {
  const { t } = useTranslation();
  const { affiliateId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('login') + ' ' + t('history');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAffiliateLoginHistory = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await AffiliateService.getAffiliateLoginHistory({
      pagination: { pageIndex, pageSize },
      affiliateUID: affiliateId
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: loginHistoryResponseMapper(result.response.data),
        totalRecords: parseInt(result?.response?.totalRecords)
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData: fetchAffiliateLoginHistory,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { enableFullScreen: false, enableRowDense: false },
      columnVisibility: { expiredAt: false }
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
      <Toolbar table={table} pageTitle={pageTitle} />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
