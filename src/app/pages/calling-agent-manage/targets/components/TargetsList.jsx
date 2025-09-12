import { Card, Skeleton } from 'components/ui';
import { XCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const TargetsList = ({ t, targets, loading }) => {
  // Initialize with all targets expanded by default
  const [expandedTargets, setExpandedTargets] = useState(() => {
    if (targets && targets.length > 0) {
      return new Set(targets.map((_, index) => index));
    }
    return new Set();
  });

  // Update expanded targets when targets change
  useEffect(() => {
    if (targets && targets.length > 0) {
      setExpandedTargets(new Set(targets.map((_, index) => index)));
    }
  }, [targets]);

  const toggleTargetExpansion = (index) => {
    const newExpanded = new Set(expandedTargets);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTargets(newExpanded);
  };
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900 dark:text-dark-100">
            {t('my_targets')}
          </h4>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!targets || targets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900 dark:text-dark-100">
            {t('my_targets')} (0)
          </h4>
        </div>
        <Card className="p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-600">
              <XCircleIcon className="h-6 w-6 text-gray-400 dark:text-dark-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-dark-100">
              No targets assigned
            </h3>
            <p className="text-gray-600 dark:text-dark-300">No targets assigned description</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-dark-400">
              Contact supervisor for targets
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900 dark:text-dark-100">
          {t('my_targets')} ({targets.length})
        </h4>
      </div>

      <div className="space-y-3">
        {targets.map((target, index) => {
          const isExpanded = expandedTargets.has(index);
          const rangeCount = target.ranges ? target.ranges.length : 0;

          return (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                {/* Clickable Header */}
                <div
                  className="-m-2 flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-dark-700"
                  onClick={() => toggleTargetExpansion(index)}>
                  <div className="flex items-center space-x-3">
                    <h5 className="font-semibold text-gray-900 dark:text-dark-100">
                      {target.targetName.charAt(0).toUpperCase() + target.targetName.slice(1)} -{' '}
                      {target.eventName.charAt(0).toUpperCase() + target.eventName.slice(1)}
                    </h5>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Range Summary */}
                    <span className="text-xs text-gray-500 dark:text-dark-400">
                      {rangeCount} {rangeCount === 1 ? t('range') : t('ranges')}
                    </span>

                    {/* Expand/Collapse Icon */}
                    <div className="flex h-8 w-8 items-center justify-center">
                      {isExpanded ? (
                        <ChevronUpIcon className="h-4 w-4 text-gray-500 dark:text-dark-400" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-dark-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                  <div className="space-y-3 border-t border-gray-200 pt-3 dark:border-dark-500">
                    <h6 className="text-sm font-medium text-gray-800 dark:text-dark-200">
                      {t('commission_ranges')}:
                    </h6>
                    {target.ranges && target.ranges.length > 0 ? (
                      <div className="space-y-2">
                        {target.ranges.map((range, rangeIndex) => (
                          <div
                            key={rangeIndex}
                            className="rounded border border-gray-200 bg-gray-50 p-3 dark:border-dark-500 dark:bg-dark-700">
                            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                              <div>
                                <span className="font-medium text-gray-600 dark:text-dark-300">
                                  {t('range')}:
                                </span>
                                <div className="font-semibold text-gray-900 dark:text-dark-100">
                                  {range.rangeMin} -{' '}
                                  {range.rangeMax === null || range.rangeMax === undefined
                                    ? t('unlimited')
                                    : range.rangeMax}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600 dark:text-dark-300">
                                  {t('commission')}:
                                </span>
                                <div className="font-semibold text-green-600 dark:text-green-400">
                                  {range.commissionRate}%
                                </div>
                              </div>
                              {range.fixedAmount && (
                                <div>
                                  <span className="font-medium text-gray-600 dark:text-dark-300">
                                    {t('fixed_amount')}:
                                  </span>
                                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                                    ${range.fixedAmount}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded border border-gray-200 bg-gray-50 p-3 text-center dark:border-dark-500 dark:bg-dark-700">
                        <p className="text-sm text-gray-500 dark:text-dark-400">
                          {t('no_commission_ranges_defined')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

TargetsList.propTypes = {
  t: PropTypes.func.isRequired,
  targets: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default TargetsList;
