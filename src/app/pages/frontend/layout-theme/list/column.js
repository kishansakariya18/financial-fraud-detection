import { createColumnHelper } from '@tanstack/react-table';
import { RowActions } from './RowActions';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { BadgeCell, IdCell } from 'components/custom/table/cell';
import { appearanceStatusOptions } from '../helper';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    header: 'ID',
    label: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: 'Name',
    label: 'Name',
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
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    label: 'Row Actions',
    cell: RowActions,
    enableSorting: false
  })
];
