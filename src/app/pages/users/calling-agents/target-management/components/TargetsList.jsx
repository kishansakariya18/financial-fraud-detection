import { Button, Card, Skeleton } from 'components/ui';
import { TrashIcon } from '@heroicons/react/24/outline';

const TargetsList = ({ t, targets, loading, onCreateNew, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (!targets || targets.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-gray-600 dark:text-dark-300">No targets configured yet.</p>
          {targets && (
            <Button onClick={onCreateNew} className="mt-2" color="primary">
              Create First Target
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {targets.map((target, index) => (
        <Card key={index} className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-dark-100">
                  {target.targetName.charAt(0).toUpperCase() + target.targetName.slice(1)} -{' '}
                  {target.eventName.charAt(0).toUpperCase() + target.eventName.slice(1)}
                </h5>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => onDelete(target)}
                  variant="outline"
                  color="error"
                  size="sm"
                  className="flex items-center space-x-1">
                  <TrashIcon className="size-4" />
                  <span>{t('delete')}</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h6 className="font-medium text-gray-800 dark:text-dark-200">Commission Ranges:</h6>
              {target.ranges.map((range, rangeIndex) => (
                <div
                  key={rangeIndex}
                  className="rounded border border-gray-200 p-3 dark:border-dark-500">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-dark-300">Range:</span>
                      <span className="ml-2 font-medium">
                        {range.rangeMin} -{' '}
                        {range.rangeMax === null || range.rangeMax === undefined
                          ? 'Unlimited'
                          : range.rangeMax}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-dark-300">Commission:</span>
                      <span className="ml-2 font-medium">{range.commissionRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TargetsList;
