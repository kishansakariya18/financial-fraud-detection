import { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import AggregatorService from 'services/aggregator.services';

export function RowActions({ row }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);

  if (!hasPermission(PERMISSIONS.AGGREGATOR.FETCH_GAMES)) {
    return null;
  }

  const handleFetchGames = async (type) => {
    try {
      setIsLoading(true);
      let result = null;
      if (type === 'QTech') {
        result = await AggregatorService.fetchQtGames();
      } else if (type === 'SoftSwiss') {
        result = await AggregatorService.fetchSoftswissGames();
      }

      if (result.status === 200) {
        const message =
          result.response?.message ||
          t('aggregator_fetch_games_success', { name: row.original.name });
        toast.success(message);
      } else {
        toast.error(result.error || t('aggregator_fetch_games_error', { name: row.original.name }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Button
        className="h-8 space-x-1.5 rounded-md px-3 text-xs"
        color="primary"
        onClick={() => handleFetchGames(row.original.name)}
        disabled={isLoading}>
        <ArrowPathIcon className={clsx('size-4', isLoading && 'animate-spin')} />
        <span>{t('aggregator_fetch_games_action')}</span>
      </Button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object
};
