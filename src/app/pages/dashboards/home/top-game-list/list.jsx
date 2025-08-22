import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLockScrollbar } from 'hooks';

import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
// import DashboardService from 'services/dashboard.services';
import { Button, Select } from 'components/ui';
import { t } from 'i18next';

export default function TopGames() {
  const [gameTimeRange, setGameTimeRange] = useState(1);
  const [gameFilter, setGameFilter] = useState(1);
  const [queryParams, setQueryParams] = useState({});

  const title = `${t('top')} ${t('games')}`;

  const gameTimeRangeOptions = [
    { value: 1, label: 'Last 7 days' },
    { value: 2, label: 'Last 30 days' },
    { value: 3, label: 'Last 90 Days' },
    { value: 4, label: 'Last 6 months' }
  ];

  const gameFilterOptions = [
    {
      value: 1,
      label: 'Top Wagered'
    },
    {
      value: 2,
      label: 'Top Payout'
    }
  ];

  const fetchTopGames = async () => {
    const data = {};

    data.timeRangeType = gameTimeRange ? gameTimeRange : 1;
    data.type = gameFilter ? gameFilter : 1;

    console.log('fetchTopGames: ', data);

    //TODO: uncomment when implemented
    // const result = await DashboardService.getTopGames(data);
    const result = {
      response: {
        data: []
      }
    };
    console.log('result: ', result.response);

    const apiData = result.response.data;

    if (result.status === 200) {
      return {
        status: 200,
        data: apiData,
        totalRecords: parseInt(result?.response?.totalRecords)
      };
    }
    return { status: result.status, error: result.error };
  };

  const handleSearch = () => {
    setQueryParams({
      gameTimeRange,
      gameFilter
    });
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    queryParams: queryParams,
    fetchData: fetchTopGames,
    initialSettings: {
      tableSettings: { enableFullScreen: false }
    },
    paginationEnabled: false
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [error]);

  useEffect(() => {
    const filtersFromQuery = [];

    setColumnFilters(filtersFromQuery);
  }, []);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="mb-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm+ font-medium uppercase tracking-wide text-gray-800 dark:text-dark-100">
          {title}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            defaultValue={gameTimeRange}
            onChange={(e) => setGameTimeRange(e.target.value)}
            data={gameTimeRangeOptions}
          />
          <Select
            defaultValue={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            data={gameFilterOptions}
          />
          <Button
            type="submit"
            color="primary"
            className="rounded px-4 py-2 font-semibold text-white"
            onClick={handleSearch}>
            Apply
          </Button>
        </div>
      </div>

      <TableCard
        tableSettings={tableSettings}
        table={table}
        loading={isLoading}
        paginationEnabled={false}
        disableDefaultPadding={true}
      />
    </div>
  );
}
