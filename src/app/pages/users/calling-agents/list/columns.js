// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell, BadgeCell } from '../../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../../components/shared/table/CopyableCell';
import { statusOptions } from '../../admin/helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Agent ID',
    header: 'Agent ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.adminUID, {
    id: 'adminUID',
    label: 'Agent UID',
    header: 'Agent UID',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Username',
    header: 'User Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.firstname, {
    id: 'firstname',
    label: 'FirstName',
    header: 'First Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.lastname, {
    id: 'lastname',
    label: 'LastName',
    header: 'Last Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.email, {
    id: 'email',
    header: 'email',
    label: 'Email',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.mobile, {
    id: 'mobile',
    header: 'Phone',
    label: 'Phone',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Agent Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Agent Date',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.lastLoginAt, {
    id: 'lastLoginAt',
    label: 'Last Login At',
    header: 'Last Login At',
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
