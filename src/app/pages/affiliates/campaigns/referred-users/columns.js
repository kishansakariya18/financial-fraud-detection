import { createColumnHelper } from '@tanstack/react-table';
import { BoldCell, DateCell, IdCell, AmountCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const columnHelper = createColumnHelper();
export const columns = [
  columnHelper.accessor((row) => row.ReferredUserID, {
    id: 'ReferredUserID',
    header: 'Referred User ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.Username, {
    id: 'Username',
    header: 'Username',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.DepositCount ? row.DepositCount : '0'), {
    id: 'DepositCount',
    header: 'Deposit Count',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CurrencySymbol, {
    id: 'Currency',
    header: 'Currency',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.FirstDepositAmount ? row.FirstDepositAmount : 0), {
    id: 'FirstDepositAmount',
    header: 'First Deposit Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.TotalDeposited ? row.TotalDeposited : 0), {
    id: 'TotalDeposited',
    header: 'Total Deposited',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.TotalWagered ? row.TotalWagered : 0), {
    id: 'TotalWagered',
    header: 'Total Wagered',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.TotalWagerLoss ? row.TotalWagerLoss : 0), {
    id: 'TotalWagerLoss',
    header: 'Total Wager Loss',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.CommissionEarned ? row.CommissionEarned : 0), {
    id: 'CommissionEarned',
    header: 'Commission Earned',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor(
    (row) => (row.LastDepositAt ? getDateInUTCToTimeZone(row.LastDepositAt) : ''),
    {
      id: 'LastDepositAt',
      header: 'Last Deposit At',
      cell: DateCell,
      filterFn: 'inNumberRange',
      enableSorting: false
    }
  )
];
