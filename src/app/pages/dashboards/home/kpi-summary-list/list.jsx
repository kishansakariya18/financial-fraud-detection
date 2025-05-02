import { useEffect } from 'react';
import { toast } from 'sonner';
import { useLockScrollbar } from 'hooks';

import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import DashboardService from 'services/dashboard.services';

export default function KPISummaryList() {
  const fetchKPISummaryList = async () => {
    const result = await DashboardService.getKPISummary({
      filters: {}
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

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchKPISummaryList,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    const filtersFromQuery = [];

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="mb-4 w-full">
      <h2 className="px-[--margin-x] text-xl">KPI Summary</h2>
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </div>
  );
}
