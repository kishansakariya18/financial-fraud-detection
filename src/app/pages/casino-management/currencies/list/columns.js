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
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    label: 'Name',
    header: 'Name',
    cell: BoldCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.status, {
  //   id: 'status',
  //   label: 'Status',
  //   header: 'Status',
  //   cell: BadgeCell,
  //   meta: { optionData: statusOptions },
  //   filterFn: 'arrIncludesSome',
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.code, {
    id: 'code',
    label: 'Code',
    header: 'Code',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.symbol, {
    id: 'symbol',
    label: 'Symbol',
    header: 'Symbol',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.exchange_rate, {
    id: 'exchange_rate',
    label: 'Exchange Rate',
    header: 'Exchange Rate',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.admin_exchange_rate, {
    id: 'admin_exchange_rate',
    label: 'Admin Exchange Rate',
    header: 'Admin Exchange Rate',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.type, {
    id: 'type',
    label: 'Type',
    header: 'Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.display({
    id: 'actions',
    label: 'Row Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
