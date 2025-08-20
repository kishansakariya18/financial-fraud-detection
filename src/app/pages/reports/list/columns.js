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
import { stageOptions, typeOptions } from '../helper';
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
  columnHelper.accessor((row) => row.betPlacementId, {
    id: 'betPlacementId',
    label: 'Bet Placement ID',
    header: 'Bet Placement ID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.betWinningTxnId, {
    id: 'betWinningTxnId',
    label: 'Bet Winning Txn ID',
    header: 'Bet Winning Txn ID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.gameName, {
    id: 'gameName',
    label: 'Game Name',
    header: 'Game Name',
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
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.winAmount, {
    id: 'winAmount',
    label: 'Win Amount',
    header: 'Win Amount',
    cell: AmountCell,
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
];
