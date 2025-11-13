import { createColumnHelper } from '@tanstack/react-table';
import { RowActions } from './RowActions';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { BadgeCell, DateCell, IdCell } from 'components/custom/table/cell';
import { appearanceStatusOptions } from '../helper';

const columnHelper = createColumnHelper();

export const columns = ({ canShowActions } = {}) => [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    header: 'ID',
    label: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: 'Layout Name',
    label: 'Layout Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.themeName, {
    id: 'themeName',
    header: 'Theme Name',
    label: 'Theme Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    header: 'Status',
    label: 'Status',
    cell: BadgeCell,
    meta: { optionData: appearanceStatusOptions },
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
          header: 'Actions',
          label: 'Row Actions',
          cell: RowActions,
          enableSorting: false
        })
      ]
    : [])
];
