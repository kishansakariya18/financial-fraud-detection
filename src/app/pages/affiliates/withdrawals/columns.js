// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, DateCell, AmountCell, BadgeCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
import { affiliatesWithdrawalsStatusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.transactionID, {
    id: 'transactionID',
    label: 'Transaction ID',
    header: 'Transaction ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Username',
    header: 'Username',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.currencyCode, {
    id: 'currencyCode',
    label: 'Currency Code',
    header: 'Currency Code',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.amount, {
    id: 'amount',
    label: 'Amount',
    header: 'Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.transactionStatus, {
    id: 'transactionStatus',
    label: 'Transaction Status',
    header: 'Transaction Status',
    cell: BadgeCell,
    meta: { optionData: affiliatesWithdrawalsStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created Date',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'actions',
    label: 'Row Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
