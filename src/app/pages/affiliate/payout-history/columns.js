// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, AmountCell, BadgeCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { payoutStatusOptions, payoutTxnStatusOptions } from '../helper';
import { RowActions } from './RowActions';

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
  columnHelper.accessor((row) => row.amount, {
    id: 'amount',
    label: 'Amount',
    header: 'Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.rejectReason, {
    id: 'rejectReason',
    label: 'Reject Reason',
    header: 'Reject Reason',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Approval Status',
    meta: { optionData: payoutStatusOptions },
    cell: BadgeCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.transactionStatus, {
    id: 'transactionStatus',
    label: 'Txn. Status',
    header: 'Txn. Status',
    meta: { optionData: payoutTxnStatusOptions },
    cell: BadgeCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.requestedAt, {
    id: 'requestedAt',
    label: 'Requested At',
    header: 'Requested At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.updatedAt, {
    id: 'updatedAt',
    label: 'Updated At',
    header: 'Updated At',
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
