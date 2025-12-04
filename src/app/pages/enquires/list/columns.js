// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, BoldCell, BadgeCell } from 'components/custom/table/cell';
import { RowActions } from './RowActions';
import { enquiresStatusOptions, enquiresSubjectOptions } from '../helper';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.subject, {
    id: 'Subject',
    header: 'Subject',
    cell: BoldCell,
    meta: { optionData: enquiresSubjectOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.description, {
    id: 'Description',
    header: 'Description',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.email, {
    id: 'Email',
    header: 'Email',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: enquiresStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'Created At',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'action',
    header: 'Action',
    cell: RowActions,
    enableSorting: false
  })
];
