import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, BoldCell, BadgeCell } from '../../../../../components/custom/table/cell';
// import {  } from '../helper';
import { statusOptions } from '../helper';
// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'Name',
    header: 'Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.code, {
    id: 'Code',
    header: 'Code',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.symbol, {
    id: 'Symbol',
    header: 'Symbol',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.type, {
    id: 'Type',
    header: 'Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.decimal_places, {
    id: 'Decimal Places',
    header: 'Decimal Places',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.exchangeUpdateType, {
    id: 'Exchange Update Type',
    header: 'Exchange Update Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
