// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, BoldCell, DateCell, AmountCell } from '../../../../custom/table/cell';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const agentWalletColumns = [
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
  columnHelper.accessor((row) => row.balance, {
    id: 'balance',
    label: 'Balance',
    header: 'Balance',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.lineUpBalance, {
    id: 'lineUpBalance',
    label: 'LineUp Balance',
    header: 'LineUp Balance',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalBalance, {
    id: 'totalBalance',
    label: 'Total Balance',
    header: 'Total Balance',
    cell: AmountCell,
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
