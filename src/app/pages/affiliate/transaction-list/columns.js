// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import {
  IdCell,
  DateCell,
  BoldCell,
  BadgeCell,
  AmountCell
} from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
import { transactionStatusOption, transactionTypeOption } from 'app/pages/users/player/helper';
import { affiliateTransactionTypeOption } from '../helper';

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
  columnHelper.accessor((row) => row.transactionUID, {
    id: 'transactionUID',
    label: 'Transaction UID',
    header: 'Transaction UID',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.userName, {
    id: 'username',
    label: 'User Name',
    header: 'User Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.email, {
    id: 'email',
    header: 'email',
    label: 'Email',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.transactionType, {
    id: 'transactionType',
    header: 'Transaction Type',
    label: 'Transaction Type',
    cell: BadgeCell,
    meta: { optionData: affiliateTransactionTypeOption },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.mobile, {
    id: 'mobile',
    header: 'Phone',
    label: 'Phone',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.amount, {
    id: 'amount',
    header: 'Amount',
    label: 'Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.commission, {
    id: 'commission',
    header: 'Commission',
    label: 'Commission',
    cell: AmountCell,
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
    label: 'Type',
    header: 'Type',
    cell: BadgeCell,
    meta: { optionData: transactionTypeOption },
    filterFn: 'arrIncludesSome',
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
