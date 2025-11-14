import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { Button } from 'components/ui';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';

import { columns } from './columns';
import { responseMapper } from '../helper';
import { clearAggregatorSync, useAggregatorSyncStore } from './useAggregatorSyncStore';
import { getQueryParams } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import AggregatorService from 'services/aggregator.services';
import { useLockScrollbar } from 'hooks';
import { XCircleIcon } from '@heroicons/react/24/outline';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
function AggregatorToolbar({ pageTitle, tableSettings }) {
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
      </div>
    </div>
  );
}

export default function AggregatorList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { status, activeAggregator, message } = useAggregatorSyncStore();

  const pageTitle = t('casino_aggregator');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { hasPermission } = usePermissions();
  const canShowActions = hasPermission(PERMISSIONS.AGGREGATORS.FEED_GAMES);

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
    columns: columns({ canShowActions }),
    fetchData: fetchAggregators,
    fetchSummary: async () => ({ status: 200 }),
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: canShowActions ? ['actions'] : [] },
      tableSettings: {}
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, isLoading, setError]);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      {(status === 'loading' || status === 'error') && (
        <div
          className={clsx(
            'transition-content mt-6 pb-4',
            tableSettings.enableFullScreen ? 'px-4 sm:px-5' : 'px-[--margin-x]'
          )}>
          <div
            className={clsx(
              'rounded-md border px-4 py-3 text-sm',
              status === 'error'
                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200'
                : 'dark:text-dark-25 border-primary-100 bg-primary-50 text-primary-700 dark:border-dark-400 dark:bg-dark-500'
            )}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex-1">
                {status === 'error'
                  ? message ||
                    t('aggregator_fetch_games_banner_error', {
                      name: activeAggregator || t('casino_aggregator')
                    })
                  : t('aggregator_fetch_games_in_progress_banner', {
                      name: activeAggregator || t('casino_aggregator')
                    })}
              </p>
              {status === 'error' && (
                <Button
                  onClick={clearAggregatorSync}
                  isIcon
                  color="error"
                  variant="soft"
                  className="shrink-0"
                  aria-label="Clear Button">
                  <XCircleIcon className="size-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      <AggregatorToolbar pageTitle={pageTitle} tableSettings={tableSettings} />
      <TableCard table={table} tableSettings={tableSettings} loading={isLoading} />
    </ContentWrapper>
  );
}

AggregatorToolbar.propTypes = {
  pageTitle: PropTypes.string,
  tableSettings: PropTypes.shape({
    enableFullScreen: PropTypes.bool
  })
};
