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
import { transactionStatusOption, transactionTypeOption } from '../helper';
// import { transactionStatusOption } from "../helper";
// import { CopyableCell } from "../../../../../components/shared/table/CopyableCell";
// import { playerStatusOptions } from "../helper";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Transaction ID',
    header: 'Transaction ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.transactionUID, {
    id: 'transactionUID',
    label: 'Transaction UID',
    header: 'Transaction UID',
    cell: BoldCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.username, {
  //   id: 'username',
  //   label: 'User Name',
  //   header: 'User Name',
  //   cell: BoldCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.transactionType, {
    id: 'transactionType',
    label: 'TransactionType',
    header: 'Transaction Type',
    cell: BoldCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.userUID, {
  //     id: "userUID",
  //     label: "UserUID",
  //     header: "User UID",
  //     cell: BoldCell,
  //     enableSorting: false,
  // }),
  // columnHelper.accessor((row) => row.email, {
  //     id: "email",
  //     header: "email",
  //     label: "Email",
  //     cell: CopyableCell,
  //     enableSorting: false,
  //   }),
  //   columnHelper.accessor((row) => row.mobile, {
  //     id: "mobile",
  //     header: "Phone",
  //     label: "Phone",
  //     cell: CopyableCell,
  //     enableSorting: false,
  //   }),
  columnHelper.accessor((row) => row.realCashAmount, {
    id: 'amount',
    header: 'Amount',
    label: 'Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.currency.name, {
    id: 'currency',
    header: 'Currency',
    label: 'Currency',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.baseCurrencyRate, {
    id: 'baseCurrencyRate',
    header: 'Base Currency Rate',
    label: 'BaseCurrencyRate',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.baseCurrencyValue, {
    id: 'baseCurrencyValue',
    header: 'Base Currency Value',
    label: 'BaseCurrencyValue',
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
    meta: { optionData: transactionStatusOption },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.type, {
    id: 'type',
    label: 'Type',
    header: 'Type',
    cell: BadgeCell,
    meta: { optionData: transactionTypeOption },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.lastLoginAt, {
  //     id: "lastLoginAt",
  //     label: "Last Login At",
  //     header: "Last Login At",
  //     cell: DateCell,
  //     filterFn: "inNumberRange",
  //     enableSorting: false,
  // }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Date',
    header: 'Created At',
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
