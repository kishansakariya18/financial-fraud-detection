import { createColumnHelper } from '@tanstack/react-table';
import { IdCell, OneLineDateCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.Username, {
    id: 'username',
    label: 'Username',
    header: 'Username',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.UserID, {
    id: 'userID',
    label: 'User ID',
    header: 'User ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.DateCreated, {
    id: 'date',
    label: 'Date',
    header: 'Date',
    cell: OneLineDateCell,
    enableSorting: false
  })
];
