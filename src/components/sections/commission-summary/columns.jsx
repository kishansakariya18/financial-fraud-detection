import { createColumnHelper } from '@tanstack/react-table';

import { RowActions } from './RowActions';
import { IdCell, DateCell, BadgeCell, AmountCell } from 'components/custom/table/cell';
import { redeemRequestStatusOptions } from './helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Summary ID',
    header: 'Summary ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.targetName, {
    id: 'targetName',
    label: 'Target',
    header: 'Target',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.eventName, {
    id: 'eventName',
    label: 'Event',
    header: 'Event',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.periodStart, {
    id: 'periodStart',
    label: 'Period Start',
    header: 'Period Start',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.periodEnd, {
    id: 'periodEnd',
    label: 'Period End',
    header: 'Period End',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalEventAmount, {
    id: 'totalEventAmount',
    header: 'Total Event Amount',
    label: 'Total Event Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.commissionAmount, {
    id: 'commissionAmount',
    header: 'Commission',
    label: 'Commission',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.isRedeemed, {
    id: 'isRedeemed',
    label: 'Redeem Status',
    header: 'Redeem Status',
    cell: BadgeCell,
    meta: {
      optionData: [
        { value: 'done', label: 'Redeemed', color: 'success' },
        { value: 'pending', label: 'Pending', color: 'warning' }
      ]
    },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.redeemRequestStatus, {
    id: 'redeemRequestStatus',
    label: 'Request Status',
    header: 'Request Status',
    cell: BadgeCell,
    meta: {
      optionData: redeemRequestStatusOptions
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created At',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'actions',
    label: 'Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
