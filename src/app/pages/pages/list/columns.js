// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, BadgeCell } from '../../../../components/custom/table/cell';
// import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
import { pagesOptions } from '../helper';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Page ID',
    header: 'Page ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: 'Page Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: pagesOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
