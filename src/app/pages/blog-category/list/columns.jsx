// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import {
  IdCell,
  DateCell,
  BoldCell,
  BadgeCell,
  ImageWithPreviewCell
} from '../../../../components/custom/table/cell';
import { statusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = ({ canShowActions } = {}) => [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Category ID',
    header: 'Category ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.imageUrl, {
    id: 'image',
    label: 'Image',
    header: 'Image',
    cell: (row) => ImageWithPreviewCell({ info: row }),
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    label: 'Category Name',
    header: 'Category Name',
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
    label: 'Created At',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  ...(canShowActions
    ? [
        columnHelper.display({
          id: 'actions',
          label: 'Row Actions',
          header: 'Actions',
          cell: RowActions,
          enableSorting: false
        })
      ]
    : [])
];
