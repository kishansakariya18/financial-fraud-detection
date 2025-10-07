// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { DateCell, IdCell } from '../../../../components/custom/table/cell';
import { BoldCell, BadgeCell } from '../../../../components/custom/table/cell';
import { payoutStatusOptions } from '../helper';
// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();
// "UserBankDepositUID": "Uz5NpT4Y7FH",
// "UserID": 1,
// "DepositBankAccountID": 1,
// "Amount": 12,
// "DepositTime": "2025-07-26 08:30:15",
// "ScreenshotURL": "bucketurl",
// "DepositStatus": 0,
// "VerifiedByAdminID": null,
// "RejectionReason": null,
// "Remarks": null,
// "BankTransactionID": "sadf$%3#8421235",
// "DateCreated": "2025-07-28 09:35:11",
// "DateModified": "2025-07-28 09:35:11"

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Transaction ID',
    header: 'Transaction ID',
    cell: IdCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.userID, {
  //   id: 'userID',
  //   label: 'User ID',
  //   header: 'User ID',
  //   cell: BoldCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.currencyCode, {
    id: 'currency',
    label: 'Currency',
    header: 'Currency',
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
  columnHelper.accessor((row) => row.depositTime, {
    id: 'depositTime',
    label: 'Deposit Time',
    header: 'Deposit Time',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.bankTransactionID, {
    id: 'bankTransactionID',
    label: 'Bank Transaction ID',
    header: 'Bank Transaction ID',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.depositStatus, {
    id: 'depositStatus',
    label: 'Deposit Status',
    header: 'Deposit Status',
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
  // columnHelper.accessor((row) => row.isActive, {
  //   id: 'isActive',
  //   label: 'Is Active',
  //   header: 'Is Active',
  //   cell: BadgeCell,
  //   meta: { optionData: statusOptions },
  //   filterFn: 'arrIncludesSome',
  //   enableSorting: false
  // }),
  columnHelper.display({
    id: 'actions',
    label: 'Row Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
