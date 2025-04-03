import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import PlayerService from 'services/player.services';
import { loginHistoryResponseMapper } from '../helper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { Toolbar } from './Toolbar';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
// import { Breadcrumbs } from "components/shared/Breadcrumbs";

export default function LoginHistoryList() {
  const { t } = useTranslation();
  const { playerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('login') + ' ' + t('history');

  const breadcrumbs = [{ title: 'Players', path: '/player' }, { title: 'Details' }];

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchPlayers = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await PlayerService.getPlayerLoginHistory({
      pagination: { pageIndex, pageSize },
      filters: queryParams,
      playerId
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: loginHistoryResponseMapper(result.response.data),
        totalRecords: parseInt(result.response.totalRecords, 10) || 0
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData: fetchPlayers,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {},
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
      <Toolbar breadcrumbs={breadcrumbs} table={table} pageTitle={pageTitle} />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
