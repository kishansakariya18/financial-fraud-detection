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
  columnHelper.accessor((row) => row.today, {
    id: 'today',
    label: 'Today',
    header: 'Today',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.yesterday, {
    id: 'yesterday',
    label: 'Yesterday',
    header: 'Yesterday',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.monthToDate, {
    id: 'monthToDate',
    label: 'Month To Date',
    header: 'Month To Date',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.delta, {
    id: 'delta',
    label: 'Delta (%)',
    header: 'Delta (%)',
    cell: AmountCell,
    enableSorting: false
  })
];
