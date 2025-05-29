// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import {
  IdCell,
  BoldCell,
  BadgeCell,
  DateCell,
  AmountCell
} from '../../../../components/custom/table/cell';
import { playerStatusOptions } from 'app/pages/users/player/helper';
import { CopyableCell } from 'components/shared/table/CopyableCell';
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
  columnHelper.accessor((row) => row.userUID, {
    id: 'userUID',
    label: 'User UID',
    header: 'User UID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Username',
    header: 'Username',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.mobile, {
    id: 'mobile',
    label: 'Mobile',
    header: 'Mobile',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.realCash, {
    id: 'realCash',
    label: 'RealCash',
    header: 'RealCash',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.winning, {
    id: 'winning',
    label: 'Winning',
    header: 'Winning',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.bonus, {
    id: 'bonus',
    label: 'Bonus',
    header: 'Bonus',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    enableSorting: false,
    meta: { optionData: playerStatusOptions },
    filterFn: 'arrIncludesSome'
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Date',
    header: 'Date',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  })
];
