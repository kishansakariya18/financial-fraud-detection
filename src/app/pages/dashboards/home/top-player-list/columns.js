import { createColumnHelper } from '@tanstack/react-table';
import { AmountCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.Username, {
    id: 'name',
    label: 'Name',
    header: 'Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.platformPnL, {
    id: 'platformPnL',
    label: 'Platform P&L',
    header: 'Platform P&L',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalWagered, {
    id: 'totalWagered',
    label: 'Total Wagered',
    header: 'Total Wagered',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.wageredCount, {
    id: 'wageredCount',
    label: 'Wagered Count',
    header: 'Wagered Count',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalPayout, {
    id: 'totalPayout',
    label: 'Total Payout',
    header: 'Total Payout',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalDeposit, {
    id: 'totalDeposit',
    label: 'Total Deposit',
    header: 'Total Deposit',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalWithdraw, {
    id: 'totalWithdraw',
    label: 'Total Withdraw',
    header: 'Total Withdraw',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.depositCount, {
    id: 'depositCount',
    label: 'Deposit Count',
    header: 'Deposit Count',
    cell: AmountCell,
    enableSorting: false
  })
];
