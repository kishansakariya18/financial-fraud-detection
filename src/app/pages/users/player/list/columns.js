// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import {
  IdCell,
  DateCell,
  BoldCell,
  BadgeCell,
  AmountCell
} from '../../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../../components/shared/table/CopyableCell';
import { playerStatusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'User ID',
    header: 'User ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'User Name',
    header: 'User Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.userUID, {
    id: 'userUID',
    label: 'UserUID',
    header: 'User UID',
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
  columnHelper.accessor((row) => row.realCash, {
    id: 'realCash',
    header: 'RealCash',
    label: 'RealCash',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.bonus, {
    id: 'bonus',
    header: 'Bonus',
    label: 'Bonus',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Admin Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: playerStatusOptions },
    filterFn: 'arrIncludesSome',
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
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Registration Date',
    header: 'Registration Date',
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
