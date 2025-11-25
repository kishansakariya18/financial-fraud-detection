import { Card } from 'components/ui';

const SegmentationLogs = () => {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-dark-700">
          <svg
            className="h-8 w-8 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {'Logs Coming Soon'}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {'This feature is currently under development.'}
        </p>
      </div>
    </Card>
  );
};

export default SegmentationLogs;
