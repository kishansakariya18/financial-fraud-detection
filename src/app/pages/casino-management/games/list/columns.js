// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import {
  IdCell,
  BoldCell,
  BadgeCell,
  DateCell,
  ImageWithPreviewCell
} from '../../../../../components/custom/table/cell';
import { statusOptions } from '../helper';

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
  columnHelper.accessor((row) => row.image, {
    id: 'image',
    label: 'Image',
    header: 'Image',
    cell: (row) => ImageWithPreviewCell({ info: row }),
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.provider, {
    id: 'provider',
    label: 'Provider',
    header: 'Provider',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.minBetAmount, {
    id: 'minBetAmount',
    label: 'MinBet Amount',
    header: 'MinBet Amount',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.maxBetAmount, {
    id: 'maxBetAmount',
    label: 'MaxBet Amount',
    header: 'MaxBet Amount',
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
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created Date',
    header: 'Created Date',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.updatedAt, {
    id: 'updatedAt',
    label: 'Updated Date',
    header: 'Updated Date',
    cell: DateCell,
    filterFn: 'inNumberRange',
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
