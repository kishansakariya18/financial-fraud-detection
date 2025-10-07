import { createColumnHelper } from '@tanstack/react-table';
import { AmountCell, DateCell, BoldCell, BadgeCell } from 'components/custom/table/cell';

const columnHelper = createColumnHelper();

export const agentCommissionColumns = [
  columnHelper.accessor((row) => row.TargetName, {
    id: 'targetName',
    label: 'Target Name',
    header: 'Target Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.EventName, {
    id: 'eventName',
    label: 'Event Name',
    header: 'Event Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CommissionAmount, {
    id: 'commissionAmount',
    label: 'Commission Amount',
    header: 'Commission Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CalculatedAt, {
    id: 'calculatedAt',
    label: 'Calculated At',
    header: 'Calculated At',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.IsRedeemed, {
    id: 'isRedeemed',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: {
      optionData: [
        { value: 0, label: 'Available', color: 'success' },
        { value: 1, label: 'Redeemed', color: 'info' }
      ]
    },
    enableSorting: false
  })
];
