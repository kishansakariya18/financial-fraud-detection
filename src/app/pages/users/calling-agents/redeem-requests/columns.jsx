import { createColumnHelper } from '@tanstack/react-table';
import { IdCell, DateCell, BadgeCell } from '../../../../../components/custom/table/cell';
import { ensureString } from 'utils/ensureString';
import { Highlight } from 'components/shared/Highlight';
import { RowActions } from './RowActions';

const columnHelper = createColumnHelper();

export const columns = ({ onApprove, onReject, onSettle }) => [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Request ID',
    header: 'Request ID',
    cell: IdCell,
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.agentInfo?.username, {
    id: 'agent',
    label: 'Agent',
    header: 'Agent',
    cell: (info) => {
      const globalQuery = ensureString(info.table.getState().globalFilter);
      const columnQuery = ensureString(info.column.getFilterValue());
      const agent = info.row.original.agentInfo;

      if (!agent) return '-';

      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800 dark:text-dark-100">
            <Highlight query={[globalQuery, columnQuery]}>{agent.username || 'N/A'}</Highlight>
          </span>
          <span className="text-sm text-gray-600 dark:text-dark-300">
            {agent.firstName} {agent.lastName}
          </span>
        </div>
      );
    },
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.requestedAmount, {
    id: 'requestedAmount',
    label: 'Requested Amount',
    header: 'Requested Amount',
    cell: (info) => (
      <span className="font-medium text-gray-900 dark:text-dark-100">
        {parseFloat(info.getValue() || 0).toFixed(2)}
      </span>
    ),
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.approvedAmount, {
    id: 'approvedAmount',
    label: 'Approved Amount',
    header: 'Approved Amount',
    cell: (info) => {
      const amount = info.getValue();
      return amount ? (
        <span className="font-medium text-green-600 dark:text-green-400">
          {parseFloat(amount).toFixed(2)}
        </span>
      ) : (
        <span className="text-gray-500 dark:text-dark-400">-</span>
      );
    },
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    enableSorting: false,
    meta: {
      optionData: [
        { value: 'pending', label: 'Pending', color: 'warning' },
        { value: 'approved', label: 'Approved', color: 'info' },
        { value: 'settled', label: 'Settled', color: 'success' },
        { value: 'rejected', label: 'Rejected', color: 'error' }
      ]
    }
  }),

  columnHelper.accessor((row) => row.requestedAt, {
    id: 'requestedAt',
    label: 'Requested Date',
    header: 'Requested Date',
    cell: DateCell,
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.approvedAt, {
    id: 'approvedAt',
    label: 'Approved Date',
    header: 'Approved Date',
    cell: (info) => {
      const date = info.getValue();
      return date ? DateCell(info) : <span className="text-gray-500 dark:text-dark-400">-</span>;
    },
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.remarks, {
    id: 'remarks',
    label: 'Remarks',
    header: 'Remarks',
    cell: (info) => {
      const remarks = info.getValue();
      const globalQuery = ensureString(info.table.getState().globalFilter);
      const columnQuery = ensureString(info.column.getFilterValue());

      return remarks ? (
        <div className="max-w-xs truncate" title={remarks}>
          <Highlight query={[globalQuery, columnQuery]}>{remarks}</Highlight>
        </div>
      ) : (
        <span className="text-gray-500 dark:text-dark-400">-</span>
      );
    },
    enableSorting: false
  }),

  columnHelper.display({
    id: 'actions',
    label: 'Actions',
    header: 'Actions',
    cell: (info) => (
      <RowActions row={info.row} onApprove={onApprove} onReject={onReject} onSettle={onSettle} />
    ),
    enableSorting: false
  })
];
