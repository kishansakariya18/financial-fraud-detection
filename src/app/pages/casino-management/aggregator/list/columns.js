import { createColumnHelper } from '@tanstack/react-table';

import { BadgeCell, BoldCell, DateCell, IdCell } from 'components/custom/table/cell';

import { statusOptions } from '../helper';
import { RowActions } from './RowActions';

const columnHelper = createColumnHelper();

export const columns = ({ canShowActions } = {}) => [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.image, {
  //   id: 'image',
  //   label: 'Logo',
  //   header: 'Logo',
  //   cell: ImageWithPreviewCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    label: 'Name',
    header: 'Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created Date',
    header: 'Created Date',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.updatedAt, {
    id: 'updatedAt',
    label: 'Updated Date',
    header: 'Updated Date',
    cell: DateCell,
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
