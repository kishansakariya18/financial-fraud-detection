// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { BoldCell, BadgeCell, DateCell } from '../../../../custom/table/cell';
import { commissionTypeOptions } from './helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const agentCommissionColumns = (formatCurrency) => [
  columnHelper.accessor((row) => row.agentId, {
    id: 'agentId',
    label: 'Agent ID',
    header: 'Agent ID',
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.agentName, {
    id: 'agentName',
    label: 'Agent Name',
    header: 'Agent Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.agentType, {
    id: 'agentType',
    label: 'Agent Type',
    header: 'Agent Type',
    cell: ({ getValue }) => {
      const type = getValue();
      const typeMap = {
        0: { label: 'Tire 1' },
        1: { label: 'Tire 2' },
        2: { label: 'Tire 3' }
      };
      const typeInfo = typeMap[type] || { label: 'Unknown', color: 'warning' };
      return <span>{typeInfo.label}</span>;
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.commissionType, {
    id: 'commissionType',
    label: 'Commission Type',
    header: 'Commission Type',
    cell: BadgeCell,
    enableSorting: false,
    meta: { optionData: commissionTypeOptions },
    filterFn: 'arrIncludesSome'
  }),
  columnHelper.accessor((row) => formatCurrency(row.commissionEarned || 0), {
    id: 'commissionEarned',
    label: 'Commission Earned',
    header: 'Commission Earned',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.transactionId, {
    id: 'transactionId',
    label: 'Transaction ID',
    header: 'Transaction ID',
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? (
        <span className="font-medium">{value}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.remarks, {
    id: 'remarks',
    label: 'Remarks',
    header: 'Remarks',
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? (
        <span className="text-sm">{value}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.dateCreated, {
    id: 'dateCreated',
    label: 'Date Created',
    header: 'Date Created',
    cell: DateCell,
    enableSorting: false
  })
];
