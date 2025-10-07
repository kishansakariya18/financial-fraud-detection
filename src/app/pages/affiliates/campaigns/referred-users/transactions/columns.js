// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, BoldCell, BadgeCell, AmountCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { referredTxnPlanTypeOptions, referredTxnStatusOptions } from './helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.referenceId, {
    id: 'referenceId',
    label: 'Referrence ID',
    header: 'Referrence ID',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'User Name',
    header: 'User Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.planType, {
    id: 'planType',
    header: 'Type',
    label: 'Type',
    cell: BadgeCell,
    meta: { optionData: referredTxnPlanTypeOptions },
    enableSorting: false
  }),
  // Currency column: filter by currencyID, display currency code
  columnHelper.accessor((row) => row?.currency?.id, {
    id: 'currencyID',
    header: 'Currency',
    label: 'Currency',
    cell: ({ row }) => row?.original?.currency?.code || '-',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.amount, {
    id: 'amount',
    header: 'Amount',
    label: 'Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: referredTxnStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.type, {
  //   id: 'type',
  //   label: 'Type',
  //   header: 'Type',
  //   cell: BadgeCell,
  //   meta: { optionData: transactionTypeOption },
  //   filterFn: 'arrIncludesSome',
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.balanceAfter, {
    id: 'balanceAfter',
    label: 'Balance After',
    header: 'Balance After',
    cell: AmountCell,
    enableSorting: false
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
