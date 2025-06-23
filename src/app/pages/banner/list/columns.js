// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, BoldCell, BadgeCell, DateCell } from '../../../../components/custom/table/cell';
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
  columnHelper.accessor((row) => row.headline, {
    id: 'headline',
    label: 'Headline',
    header: 'Headline',
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
  columnHelper.accessor((row) => row.startDate, {
    id: 'startDate',
    label: 'Start Date',
    header: 'Start Date',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.endDate, {
    id: 'endDate',
    label: 'End Date',
    header: 'End Date',
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
