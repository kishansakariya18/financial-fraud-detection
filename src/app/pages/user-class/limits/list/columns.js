// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell } from '../../../../../components/custom/table/cell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.limitType, {
    id: 'limitType',
    header: 'Limit Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.limitPeriod, {
    id: 'limitPeriod',
    header: 'Limit Period',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.limitAmount, {
    id: 'limitAmount',
    header: 'Limit Amount',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.updatedAt, {
    id: 'updatedAt',
    header: 'Last Updated',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
