// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, BoldCell } from '../../../../components/custom/table/cell';
import { BadgeCell } from '../../../../components/custom/table/cell';
import { statusOptions } from '../../../../app/pages/manual-bank-deposit/helper';

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
  columnHelper.accessor((row) => row.bankName, {
    id: 'bankName',
    label: 'Bank Name',
    header: 'Bank Name',
    cell: BoldCell,

    enableSorting: false
  }),
  columnHelper.accessor((row) => row.accountHolderName, {
    id: 'accountHolderName',
    label: 'Account Holder Name',
    header: 'Account Holder Name',
    cell: BoldCell,

    enableSorting: false
  }),
  columnHelper.accessor((row) => row.bankCode, {
    id: 'bankCode',
    label: 'Bank Code',
    header: 'Bank Code',
    cell: BoldCell,
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.accountNumber, {
    id: 'accountNumber',
    label: 'Account Number',
    header: 'Account Number',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.upiId, {
    id: 'upiId',
    label: 'UPI ID',
    header: 'UPI ID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    filterFn: 'arrIncludesSome',
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
