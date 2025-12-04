// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, SafeAmountCell } from '../../../../../components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.ContributionID, {
    id: 'ContributionID',
    label: 'Contribution ID',
    header: 'Contribution ID',
    cell: IdCell,
    enableSorting: false,
    size: 120
  }),
  columnHelper.accessor((row) => row.UserID, {
    id: 'UserID',
    label: 'User ID',
    header: 'User ID',
    cell: IdCell,
    enableSorting: false,
    size: 100
  }),
  columnHelper.accessor((row) => row.BetTxnID, {
    id: 'BetTxnID',
    label: 'Bet Transaction ID',
    header: 'Bet Txn ID',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.BetAmount, {
    id: 'BetAmount',
    label: 'Bet Amount',
    header: 'Bet Amount',
    cell: SafeAmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.ContributionAmount, {
    id: 'ContributionAmount',
    label: 'Contribution Amount',
    header: 'Contribution Amount',
    cell: SafeAmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.DateCreated, {
    id: 'DateCreated',
    label: 'Date Created',
    header: 'Date Created',
    cell: DateCell,
    enableSorting: false
  })
];
