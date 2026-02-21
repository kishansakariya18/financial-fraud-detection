import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import PlayerService from 'services/users.services';
import { playerNotesResponseMapper } from '../helper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { Toolbar } from './Toolbar';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

export default function PlayerNotes({ playerId: initialPlayerId = null, breadcrumbs = null }) {
  const { t } = useTranslation();
  const params = useParams();
  const playerId = initialPlayerId || params.playerId;
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('player') + ' ' + t('notes');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchPlayers = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await PlayerService.getPlayerNotes({
      pagination: { pageIndex, pageSize },
      playerId
    });

    if (result.status === 200) {
      const response = playerNotesResponseMapper(result.response.data);
      return {
        status: 200,
        data: response,
        totalRecords: parseInt(result.response.totalRecords, DEFAULT_PER_PAGE_RECORD) || 0
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
      tableSettings: {}
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
      <Toolbar table={table} pageTitle={t('player') + ' ' + t('notes')} breadcrumbs={breadcrumbs} />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
