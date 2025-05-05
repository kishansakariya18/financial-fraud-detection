import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLockScrollbar } from 'hooks';

import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import DashboardService from 'services/dashboard.services';
import { Button, Select } from 'components/ui';
import { t } from 'i18next';

export default function TopPlayers() {
  const [playerTimeRange, setPlayerTimeRange] = useState(1);
  const [playerFilter, setPlayerFilter] = useState(1);
  const [queryParams, setQueryParams] = useState({});

  const title = `${t('top')} ${t('players')}`;

  const playerTimeRangeOptions = [
    { value: 1, label: 'Last 7 days' },
    { value: 2, label: 'Last 30 days' },
    { value: 3, label: 'Last 90 Days' },
    { value: 4, label: 'Last 6 months' }
  ];

  const playerFilterOptions = [
    {
      value: 1,
      label: 'Top Wagered'
    },
    {
      value: 2,
      label: 'Top Payout'
    }
  ];

  const fetchTopPlayers = async () => {
    const data = {};

    data.timeRangeType = playerTimeRange ? playerTimeRange : 1;
    data.type = playerFilter ? playerFilter : 1;

    console.log('fetchTopPlayers: ', data);

    const result = await DashboardService.getTopPlayers({
      data
    });
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
      playerTimeRange,
      playerFilter
    });
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    queryParams,
    fetchData: fetchTopPlayers,
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
      <div className="flex flex-wrap items-center justify-between gap-2 px-[--margin-x]">
        <h2 className="text-sm+ font-medium uppercase tracking-wide text-gray-800 dark:text-dark-100">
          {title}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            defaultValue={playerTimeRange}
            onChange={(e) => setPlayerTimeRange(e.target.value)}
            data={playerTimeRangeOptions}
          />
          <Select
            defaultValue={playerFilter}
            onChange={(e) => setPlayerFilter(e.target.value)}
            data={playerFilterOptions}
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
      />
    </div>
  );
}
