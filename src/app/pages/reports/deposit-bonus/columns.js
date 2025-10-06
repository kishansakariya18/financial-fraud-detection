// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, BoldCell, BadgeCell, DateCell } from '../../../../components/custom/table/cell';
import { transactionStatusOption } from 'components/sections/player-management/helper';
// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Transaction ID',
    header: 'Transaction ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.userId, {
    id: 'userId',
    label: 'User ID',
    header: 'User ID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Username',
    header: 'Username',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.mobile, {
    id: 'mobile',
    label: 'Mobile',
    header: 'Mobile',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.amount, {
    id: 'amount',
    label: 'Amount',
    header: 'Amount',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    enableSorting: false,
    meta: { optionData: transactionStatusOption },
    filterFn: 'arrIncludesSome'
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Date',
    header: 'Date',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  })
];
