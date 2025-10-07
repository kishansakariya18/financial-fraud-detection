// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

import { IdCell, DateCell, BoldCell, CreateMarkupCell } from 'components/custom/table/cell';
import { RowActions } from './RowActions';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'Note ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.note, {
    id: 'note',
    label: 'Note',
    header: 'Note',
    cell: CreateMarkupCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.adminName, {
    id: 'adminName',
    label: 'Note Added By',
    header: 'Note Added By',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.isPinned, {
    id: 'isPinned',
    label: 'Pinned',
    header: 'Pinned',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    header: 'Created At',
    label: 'Created At',
    cell: DateCell,
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
