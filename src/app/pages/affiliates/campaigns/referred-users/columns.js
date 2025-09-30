import { BaseCurrencyAmountCell, BoldCell, DateCell, IdCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();
export const columns = [
  columnHelper.accessor((row) => row.UserID, {
    id: 'UserID',
    header: 'User ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.Username, {
    id: 'Username',
    header: 'Username',
    cell: CopyableCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.CampaignID, {
  //   id: 'CampaignID',
  //   header: 'Campaign ID',
  //   cell: CopyableCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.FirstDepositAmount, {
    id: 'FirstDepositAmount',
    header: 'First Deposit Amount',
    cell: BaseCurrencyAmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.DepositCount ? row.DepositCount : '0'), {
    id: 'DepositCount',
    header: 'Deposit Count',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.TotalDeposited, {
    id: 'TotalDeposited',
    header: 'Total Deposited',
    cell: BaseCurrencyAmountCell,
    enableSorting: false
  }),
  columnHelper.accessor(
    (row) => (row.LastDepositAt ? getDateInUTCToTimeZone(row.LastDepositAt) : undefined),
    {
      id: 'LastDepositAt',
      header: 'Last Deposit At',
      cell: DateCell,
      enableSorting: false
    }
  ),
  columnHelper.accessor((row) => row.TotalWagered, {
    id: 'TotalWagered',
    header: 'Total Wagered',
    cell: BaseCurrencyAmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.TotalWagerLoss, {
    id: 'TotalWagerLoss',
    header: 'Total Wager Loss',
    cell: BaseCurrencyAmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CommissionEarned, {
    id: 'CommissionEarned',
    header: 'Commission Earned',
    cell: BaseCurrencyAmountCell,
    enableSorting: false
  })
];
