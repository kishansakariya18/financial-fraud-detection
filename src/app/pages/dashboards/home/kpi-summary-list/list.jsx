import { useEffect } from 'react';
import { toast } from 'sonner';
import { useLockScrollbar } from 'hooks';

import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
// import DashboardService from 'services/dashboard.services';
import { t } from 'i18next';

export default function KPISummaryList() {
  const title = `${t('kpi')} ${t('summary')}`;

  const fetchKPISummaryList = async () => {
    //TODO: uncomment when implemented
    // const result = await DashboardService.getKPISummary({
    //   filters: {}
    // });
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
  }, [error]);

  useEffect(() => {
    const filtersFromQuery = [];

    setColumnFilters(filtersFromQuery);
  }, []);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="mb-4 w-full">
      <h2 className="text-sm+ font-medium uppercase tracking-wide text-gray-800 dark:text-dark-100">
        {title}
      </h2>
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
