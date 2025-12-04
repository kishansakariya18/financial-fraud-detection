import PropTypes from 'prop-types';
import { Card, Skeleton } from 'components/ui';
import { t } from 'i18next';
import moment from 'moment';
import { setAmountBN } from 'helpers/functions';

// Helper function to format date range
const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';

  const start = moment(startDate).format('DD MMM');
  const end = moment(endDate).format('DD MMM YYYY');

  return `(${start} - ${end})`;
};

const TargetProgressCard = ({ targetProgress, loading = false }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-4 h-6 w-64" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-4 h-8 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  if (!targetProgress || !targetProgress.hasTargets) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-dark-100">
          {t('target')} {t('progress')} / {t('forecast')}
        </h3>
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t('no')} {t('target')} {t('set')} {t('for')} {t('current')} {t('period')}
          </p>
        </div>
      </Card>
    );
  }

  const { events } = targetProgress;

  // Filter events that have actual targets
  const activeEvents = Object.entries(events || {}).filter(
    ([, eventData]) => eventData && eventData.target > 0
  );
  if (activeEvents.length === 0) {
    return null;
  }
  // If no active events, show no targets message
  // if (activeEvents.length === 0) {
  //   return (
  //     <Card className="p-6">
  //       <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-dark-100">
  //         {t('target')} {t('progress')} / {t('forecast')}
  //       </h3>
  //       <div className="py-8 text-center">
  //         <p className="text-gray-500 dark:text-gray-400">
  //           {t('no')} {t('target')} {t('set')} {t('for')} {t('current')} {t('period')}
  //         </p>
  //       </div>
  //     </Card>
  //   );
  // }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-dark-100">
        {t('target')} {t('progress')} / {t('forecast')}
      </h3>

      {/* Events Progress Section */}
      <div className="space-y-4">
        {activeEvents.map(([eventName, eventData]) => {
          const { targetType, startDate, endDate, target, achieved, commission, percentage } =
            eventData;

          // Simple color for progress bars only
          const progressColors = {
            deposit: 'bg-green-500',
            loss: 'bg-red-500',
            wager: 'bg-blue-500'
          };

          const progressColor = progressColors[eventName] || 'bg-blue-500';

          return (
            <div
              key={eventName}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              {/* Event Header */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium capitalize text-gray-800 dark:text-gray-100">
                    {eventName} {t('target')}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {targetType} {formatDateRange(startDate, endDate)} • {percentage}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {achieved?.toLocaleString() || '0'} / {target?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Commission: {setAmountBN(commission, 2) || '0.00'}
                  </p>
                </div>
              </div>

              {/* Simple Progress Bar */}
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

TargetProgressCard.propTypes = {
  targetProgress: PropTypes.shape({
    hasTargets: PropTypes.bool,
    events: PropTypes.objectOf(
      PropTypes.shape({
        targetType: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        target: PropTypes.number,
        achieved: PropTypes.number,
        commission: PropTypes.number,
        percentage: PropTypes.number,
        remaining: PropTypes.number,
        status: PropTypes.string
      })
    )
  }),
  loading: PropTypes.bool
};

export default TargetProgressCard;
