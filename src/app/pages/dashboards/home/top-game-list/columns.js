import { createColumnHelper } from '@tanstack/react-table';
import { AmountCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    label: 'Name',
    header: 'Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalRevenue, {
    id: 'totalRevenue',
    label: 'Total Revenue',
    header: 'Total Revenue',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.playedBy, {
    id: 'playedBy',
    label: 'Played By',
    header: 'Played By',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalWagered, {
    id: 'totalWagered',
    label: 'Total Wagered',
    header: 'Total Wagered',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalPayout, {
    id: 'totalPayout',
    label: 'Total Payout',
    header: 'Total Payout',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.rtp, {
    id: 'rtp',
    label: 'RTP (%)',
    header: 'RTP (%)',
    cell: AmountCell,
    enableSorting: false
  })
];
