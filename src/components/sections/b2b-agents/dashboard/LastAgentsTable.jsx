import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useLockScrollbar } from 'hooks';
import { createColumnHelper } from '@tanstack/react-table';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { IdCell, BoldCell, BadgeCell, DateCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { statusOptions } from 'components/sections/b2b-agents/helper';

const columnHelper = createColumnHelper();

const createAgentColumns = () => [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Agent ID',
    header: 'Agent ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Username',
    header: 'Username',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.email, {
    id: 'email',
    header: 'Email',
    label: 'Email',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created At',
    header: 'Created At',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.lastLoginAt, {
    id: 'lastLoginAt',
    label: 'Last Login',
    header: 'Last Login',
    cell: DateCell,
    enableSorting: false
  })
];

const LastAgentsTable = ({ data = [], loading = false, onViewAgent }) => {
  const { t } = useTranslation();
  const title = `${t('last')} ${data.length} ${t('agents')}`;

  const fetchAgents = async () => {
    // Since data is passed as prop, return it directly
    return {
      status: 200,
      data: data,
      totalRecords: data.length
    };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: createAgentColumns(),
    queryParams: { dataUpdated: data.length }, // Add dependency on data length to trigger refresh
    fetchData: fetchAgents,
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
        {onViewAgent && (
          <button
            onClick={() => onViewAgent()}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            {t('view_all')}
          </button>
        )}
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
};

export default LastAgentsTable;
