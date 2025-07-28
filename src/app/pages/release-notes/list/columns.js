// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell, BadgeCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
import { releaseNoteStatusOption } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.releaseNoteUID || 'id', {
    id: 'id',
    label: 'Release Note UID',
    header: 'Release Note UID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.version || 'v0.0.0', {
    id: 'version',
    label: 'Version',
    header: 'Version',
    cell: CopyableCell,
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.title || 'title', {
    id: 'title',
    label: 'Title',
    header: 'Title',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status || 'inactive', {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: releaseNoteStatusOption },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.releaseDate, {
    id: 'releasedAt',
    label: 'Released Date',
    header: 'Released At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.modifiedAt, {
    id: 'modifiedAt',
    label: 'Modified Date',
    header: 'Modified At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created Date',
    header: 'Created At',
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
