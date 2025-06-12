// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell, BadgeCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
import { userclassOptions } from '../helper';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.title, {
    id: 'title',
    header: 'Title',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.slug, {
    id: 'slug',
    header: 'Slug',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.heading, {
    id: 'heading',
    header: 'Heading',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: userclassOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.dateModified, {
    id: 'dateModified',
    header: 'Last Modified',
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
