import { createColumnHelper } from '@tanstack/react-table';
import { RowActions } from './RowActions';
import { DateCell, IdCell, BoldCell, BadgeCell } from '../../../../components/custom/table/cell';
import { payoutStatusOptions } from '../helper';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Transaction ID',
    header: 'Transaction ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.userName, {
    id: 'userName',
    label: 'User Name',
    header: 'User Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.currencyCode, {
    id: 'currency',
    label: 'Currency',
    header: 'Currency',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.withdrawType, {
    id: 'withdrawType',
    label: 'Withdraw Type',
    header: 'Withdraw Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.amount, {
    id: 'amount',
    label: 'Amount',
    header: 'Amount',
    cell: BoldCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.depositTime, {
  //   id: 'depositTime',
  //   label: 'Deposit Time',
  //   header: 'Deposit Time',
  //   cell: DateCell,
  //   enableSorting: false
  // }),
  // columnHelper.accessor((row) => row.bankTransactionID, {
  //   id: 'bankTransactionID',
  //   label: 'Bank Transaction ID',
  //   header: 'Bank Transaction ID',
  //   cell: BoldCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.depositStatus, {
    id: 'depositStatus',
    label: 'Deposit Status',
    header: 'Withdraw Status',
    cell: BadgeCell,
    meta: { optionData: payoutStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.dateCreated, {
    id: 'dateCreated',
    label: 'Date Created',
    header: 'Date Created',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.dateModified, {
    id: 'dateModified',
    label: 'Date Modified',
    header: 'Date Modified',
    cell: DateCell,
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
