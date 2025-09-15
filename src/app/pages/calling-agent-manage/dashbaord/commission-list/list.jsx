import { useEffect } from 'react';
import { toast } from 'sonner';
import { useLockScrollbar } from 'hooks';

import { agentCommissionColumns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { t } from 'i18next';

export default function AgentCommissionList({ data = [], loading = false }) {
  const title = `${t('last')} ${t('commission')} ${t('list')}`;

  const fetchCommissions = async () => {
    // Since data is passed as prop, return it directly
    return {
      status: 200,
      data: data,
      totalRecords: data.length
    };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: agentCommissionColumns,
    queryParams: { dataUpdated: data.length }, // Add dependency on data length to trigger refresh
    fetchData: fetchCommissions,
    initialSettings: {
      tableSettings: { enableFullScreen: false }
    },
    paginationEnabled: false
  });

  // Force table refresh when data changes
  useEffect(() => {
    if (table?.options?.meta?.fetchNewList) {
      table.options.meta.fetchNewList(false);
    }
  }, [data, table]);

  useEffect(() => {
    if (!loading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, loading, setError]);

  useEffect(() => {
    setColumnFilters([]);
  }, [setColumnFilters]);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="mb-4 w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm+ font-medium uppercase tracking-wide text-gray-800 dark:text-dark-100">
          {title}
        </h2>
      </div>

      <TableCard
        tableSettings={tableSettings}
        table={table}
        loading={loading || isLoading}
        paginationEnabled={false}
        disableDefaultPadding={true}
      />
    </div>
  );
}
