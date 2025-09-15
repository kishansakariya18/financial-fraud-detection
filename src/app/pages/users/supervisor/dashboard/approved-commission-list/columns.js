import { createColumnHelper } from '@tanstack/react-table';
import { AmountCell, DateCell, BoldCell } from 'components/custom/table/cell';

const columnHelper = createColumnHelper();

export const approvedCommissionColumns = [
  columnHelper.accessor((row) => row.callingAgent?.Username, {
    id: 'agentName',
    label: 'Agent Name',
    header: 'Agent Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.callingAgent?.Email, {
    id: 'agentEmail',
    label: 'Agent Email',
    header: 'Agent Email',
    cell: BoldCell,
    enableSorting: false
  }),
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
  columnHelper.accessor((row) => row.ApprovedAt, {
    id: 'approvedAt',
    label: 'Approved At',
    header: 'Approved At',
    cell: DateCell,
    enableSorting: false
  })
];
