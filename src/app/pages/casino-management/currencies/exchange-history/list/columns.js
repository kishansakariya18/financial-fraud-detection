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
  columnHelper.accessor((row) => row.rate, {
    id: 'Rate',
    header: 'Rate',
    cell: BoldCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.exchangeRate, {
  //   id: 'Exchange Rate',
  //   header: 'Exchange Rate',
  //   cell: BoldCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.base_currency, {
    id: 'Base Currency',
    header: 'Base Currency',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.quote_currency, {
    id: 'Quote Currency',
    header: 'Quote Currency',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.effective_at, {
    id: 'Effective At',
    header: 'Effective At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  })
];
