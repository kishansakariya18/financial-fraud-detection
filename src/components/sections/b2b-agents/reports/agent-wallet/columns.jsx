// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, BoldCell, DateCell } from '../../../../custom/table/cell';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const agentWalletColumns = (formatCurrency) => [
  columnHelper.accessor((row) => row.agentId, {
    id: 'agentId',
    label: 'Agent ID',
    header: 'Agent ID',
    cell: IdCell,
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
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.commissionBalance, {
    id: 'commissionBalance',
    label: 'Commission Balance',
    header: 'Commission Balance',
    cell: ({ getValue }) => <span className="font-medium">{formatCurrency(getValue())}</span>,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.lineUpBalance, {
    id: 'lineUpBalance',
    label: 'LineUp Balance',
    header: 'LineUp Balance',
    cell: ({ getValue }) => <span className="font-medium">{formatCurrency(getValue())}</span>,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.dateModified, {
    id: 'dateModified',
    label: 'Last Modified',
    header: 'Last Modified',
    cell: DateCell,
    enableSorting: false
  })
];
