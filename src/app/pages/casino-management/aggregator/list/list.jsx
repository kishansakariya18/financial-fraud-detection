import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import clsx from 'clsx';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import ContentWrapper from 'components/ui/custom/ContentWrapper';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { Button } from 'components/ui';

import { columns } from './columns';
import { responseMapper } from '../helper';
import { getQueryParams } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD, PERMISSIONS } from 'constants/app.constant';
import AggregatorService from 'services/aggregator.services';
import { useLockScrollbar } from 'hooks';
import usePermissions from 'app/router/usePermissions';

function AggregatorToolbar({ pageTitle, onFetchAllGames, isFetchingAll, tableSettings }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const isFullScreenEnabled = tableSettings.enableFullScreen;

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
        </div>
        <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
          {hasPermission(PERMISSIONS.AGGREGATOR.FETCH_ALL_GAMES) && (
            <Button
              className="h-8 space-x-1.5 rounded-md px-3 text-xs"
              color="primary"
              onClick={onFetchAllGames}
              disabled={isFetchingAll}>
              <ArrowPathIcon className={clsx('size-4', isFetchingAll && 'animate-spin')} />
              <span>{t('aggregator_fetch_all_games_action')}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AggregatorList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  const pageTitle = t('casino_aggregator');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAggregators = async (params = {}) => {
    const pageIndex = Number.isNaN(+params.pageIndex) ? DEFAULT_PAGE_INDEX : +params.pageIndex;
    const pageSize = Number.isNaN(+params.pageSize) ? DEFAULT_PER_PAGE_RECORD : +params.pageSize;

    const result = await AggregatorService.getAggregators({
      pagination: { pageIndex, pageSize },
      filters: {
        keyword: params.keyword,
        status: params.status
      }
    });

    if (result.status === 200) {
      const totalRecords = parseInt(result.response?.totalRecords, 10) || 0;
      return {
        status: 200,
        data: responseMapper(result.response?.data || []),
        totalRecords
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData: fetchAggregators,
    fetchSummary: async () => ({ status: 200 }),
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
  }, [error, isLoading, setError]);

  const handleFetchAllGames = async () => {
    try {
      setIsFetchingAll(true);
      const result = await AggregatorService.fetchAllGames();

      if (result.status === 200) {
        const message = result.response?.message || t('aggregator_fetch_all_games_success');
        toast.success(message);
      } else {
        toast.error(result.error || t('aggregator_fetch_all_games_error'));
      }
    } finally {
      setIsFetchingAll(false);
    }
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <AggregatorToolbar
        pageTitle={pageTitle}
        onFetchAllGames={handleFetchAllGames}
        isFetchingAll={isFetchingAll}
        tableSettings={tableSettings}
      />
      <TableCard table={table} tableSettings={tableSettings} loading={isLoading} />
    </ContentWrapper>
  );
}

AggregatorToolbar.propTypes = {
  pageTitle: PropTypes.string,
  onFetchAllGames: PropTypes.func,
  isFetchingAll: PropTypes.bool,
  tableSettings: PropTypes.shape({
    enableFullScreen: PropTypes.bool
  })
};
