import { createColumnHelper } from '@tanstack/react-table';
import { AmountCell, DateCell, BoldCell } from 'components/custom/table/cell';

const columnHelper = createColumnHelper();

export const pendingRedeemColumns = [
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
  columnHelper.accessor((row) => row.RequestedAmount, {
    id: 'requestedAmount',
    label: 'Requested Amount',
    header: 'Requested Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.RequestedAt, {
    id: 'requestedAt',
    label: 'Requested At',
    header: 'Requested At',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.Remarks, {
    id: 'remarks',
    label: 'Remarks',
    header: 'Remarks',
    cell: BoldCell,
    enableSorting: false
  })
];
