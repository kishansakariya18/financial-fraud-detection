import { createColumnHelper } from '@tanstack/react-table';
import { RowActions } from './RowActions';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { BadgeCell, IdCell, ThemeSwatchCell } from 'components/custom/table/cell';
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
  columnHelper.accessor((row) => row.themePreview, {
    id: 'themePreview',
    header: 'Theme Preview',
    label: 'Theme Preview',
    cell: ThemeSwatchCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.primaryColor, {
    id: 'primaryColor',
    header: 'Primary Color',
    label: 'Primary Color',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.secondaryColor, {
    id: 'secondaryColor',
    header: 'Secondary Color',
    label: 'Secondary Color',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.fontColor1, {
    id: 'fontColor1',
    header: 'Font Color 1',
    label: 'Font Color 1',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.fontColor2, {
    id: 'fontColor2',
    header: 'Font Color 2',
    label: 'Font Color 2',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.fontColor3, {
    id: 'fontColor3',
    header: 'Font Color 3',
    label: 'Font Color 3',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.fontColor4, {
    id: 'fontColor4',
    header: 'Font Color 4',
    label: 'Font Color 4',
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
