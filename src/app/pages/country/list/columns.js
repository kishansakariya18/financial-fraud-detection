// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, BadgeCell, BoldCell } from '../../../../components/custom/table/cell';
import { statusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Country ID',
    header: 'Country ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.countryName, {
    id: 'countryName',
    label: 'Country Name',
    header: 'Country Name',
    cell: BoldCell,

    enableSorting: false
  }),
  columnHelper.accessor((row) => row.countryCode, {
    id: 'contryCode',
    label: 'Country Code',
    header: 'Country Code',
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
  columnHelper.display({
    id: 'actions',
    label: 'Row Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
