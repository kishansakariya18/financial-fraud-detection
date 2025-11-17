import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import AggregatorService from 'services/aggregator.services';
import {
  completeAggregatorSync,
  startAggregatorSync,
  useAggregatorSyncStore
} from './useAggregatorSyncStore';

export function RowActions({ row }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const { isSyncing, activeAggregator } = useAggregatorSyncStore();
  const aggregatorName = row?.original?.name;
  const isCurrentAggregator = isSyncing && activeAggregator === aggregatorName;

  if (!hasPermission(PERMISSIONS.AGGREGATORS.FEED_GAMES)) {
    return null;
  }

  const handleFetchGames = async (type) => {
    const displayName = aggregatorName || type || t('casino_aggregator');

    if (isSyncing) {
      toast.info(
        t('aggregator_fetch_games_in_progress_notice', {
          name: activeAggregator || displayName
        })
      );
      return;
    }

    try {
      startAggregatorSync(displayName);
      let result = null;
      if (type === 'QTech') {
        result = await AggregatorService.fetchQtGames();
      } else if (type === 'SoftSwiss') {
        result = await AggregatorService.fetchSoftswissGames();
      }

      if (!result) {
        const errorMessage = t('aggregator_fetch_games_error', { name: displayName });
        completeAggregatorSync({
          status: 'error',
          message: errorMessage,
          aggregatorName: displayName
        });
        return;
      }

      if (result.status === 200) {
        const message = result.response?.message;
        if (message) {
          toast.success(message);
        } else {
          toast.success(t('success'));
        }
        completeAggregatorSync();
      } else {
        const errorMessage =
          result.error || t('aggregator_fetch_games_error', { name: displayName });
        completeAggregatorSync({
          status: 'error',
          message: errorMessage,
          aggregatorName: displayName
        });
      }
    } catch (error) {
      const errorMessage =
        error?.message || t('aggregator_fetch_games_error', { name: displayName });
      completeAggregatorSync({
        status: 'error',
        message: errorMessage,
        aggregatorName: displayName
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Button
        className="h-8 space-x-1.5 rounded-md px-3 text-xs"
        color="primary"
        onClick={() => handleFetchGames(aggregatorName)}
        disabled={isSyncing}>
        <ArrowPathIcon className={clsx('size-4', isCurrentAggregator && 'animate-spin')} />
        <span>
          {isCurrentAggregator
            ? t('aggregator_fetch_games_in_progress_action')
            : t('aggregator_fetch_games_action')}
        </span>
      </Button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object
};
