// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, BoldCell } from 'components/custom/table/cell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.fromRate, {
    id: 'From Rate',
    header: 'From Rate',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.toRate, {
    id: 'To Rate',
    header: 'To Rate',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.currency, {
    id: 'Currency',
    header: 'Currency',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.amount, {
    id: 'Amount',
    header: 'Amount',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.date, {
    id: 'Date',
    header: 'Date',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  })
];
