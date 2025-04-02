// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
// import { RowActions } from './RowActions';
import { IdCell, BoldCell, BadgeCell, DateCell } from '../../../../components/custom/table/cell';
import { stageOptions, typeOptions } from '../helper';
// import { statusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.userId, {
    id: 'userId',
    label: 'User ID',
    header: 'User ID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.betId, {
    id: 'betId',
    label: 'Bet ID',
    header: 'Bet ID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.referenceId, {
    id: 'referenceId',
    label: 'Reference ID',
    header: 'Reference ID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Username',
    header: 'Username',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.mobile, {
    id: 'mobile',
    label: 'Mobile',
    header: 'Mobile',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.betAmount, {
    id: 'betAmount',
    label: 'Bet Amount',
    header: 'Bet Amount',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.winAmount, {
    id: 'winAmount',
    label: 'Win Amount',
    header: 'Win Amount',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.userAmount, {
    id: 'userAmount',
    label: 'User Amount',
    header: 'User Amount',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.platformAmount, {
    id: 'platformAmount',
    label: 'Platform Amount',
    header: 'Platform Amount',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.stage, {
    id: 'stage',
    label: 'Stage',
    header: 'Stage',
    cell: BadgeCell,
    enableSorting: false,
    meta: { optionData: stageOptions },
    filterFn: 'arrIncludesSome'
  }),
  columnHelper.accessor((row) => row.type, {
    id: 'type',
    label: 'User Profit/Loss',
    header: 'User Profit/Loss',
    cell: BadgeCell,
    enableSorting: false,
    meta: { optionData: typeOptions },
    filterFn: 'arrIncludesSome'
  }),
  columnHelper.accessor((row) => row.platformType, {
    id: 'platformType',
    label: 'Platform Profit/Loss',
    header: 'Platform Profit/Loss',
    cell: BadgeCell,
    enableSorting: false,
    meta: { optionData: typeOptions },
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
  // columnHelper.display({
  //   id: 'actions',
  //   label: 'Row Actions',
  //   header: 'Actions',
  //   cell: RowActions,
  //   enableSorting: false
  // })
];
