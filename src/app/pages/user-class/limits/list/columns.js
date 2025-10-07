// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import {
  IdCell,
  DateCell,
  BoldCell,
  BaseCurrencyAmountCell
} from '../../../../../components/custom/table/cell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.limitType, {
    id: 'Limit Type',
    header: 'Limit Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.limitPeriod, {
    id: 'Limit Period',
    header: 'Limit Period',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.limitAmount, {
    id: 'Limit Amount',
    header: 'Limit Amount',
    cell: BaseCurrencyAmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'Created At',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.updatedAt, {
    id: 'Last Updated',
    header: 'Last Updated',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
