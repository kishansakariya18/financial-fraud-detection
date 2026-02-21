// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import {
  transactionStatusOption,
  transactionTypeOption
} from 'components/sections/player-management/helper';
import { IdCell, DateCell, BoldCell, BadgeCell } from 'components/custom/table/cell';

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
  columnHelper.accessor((row) => row.transactionUID, {
    id: 'transactionUID',
    label: 'Transaction UID',
    header: 'Transaction UID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Player',
    header: 'Player',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.transactionType, {
    id: 'transactionType',
    label: 'Transaction Type',
    header: 'Transaction Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.transactionAmount, {
    id: 'transactionAmount',
    header: 'Transaction Amount',
    label: 'Transaction Amount',
    cell: ({ row }) => {
      const amount = row.original.transactionAmount;
      const currency = row.original.currency;
      return (
        <div className="font-medium">
          {currency?.symbol && (
            <span className="mr-1 text-xs text-gray-500">{currency.symbol}</span>
          )}
          {amount || '0'}
        </div>
      );
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: transactionStatusOption },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.type, {
    id: 'type',
    label: 'Credit/Debit',
    header: 'Credit/Debit',
    cell: BadgeCell,
    meta: { optionData: transactionTypeOption },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Date',
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
