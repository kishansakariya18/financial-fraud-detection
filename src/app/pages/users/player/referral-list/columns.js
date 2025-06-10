// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
// import { RowActions } from './RowActions';
import {
  // IdCell,
  DateCell,
  BoldCell,
  AmountCell
} from '../../../../../components/custom/table/cell';
// import { transactionStatusOption, transactionTypeOption } from '../helper';
// import { transactionStatusOption } from "../helper";
// import { CopyableCell } from "../../../../../components/shared/table/CopyableCell";
// import { playerStatusOptions } from "../helper";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

// id: item.ReferralID,
//       username: userData.username,
//       mobile: item.user.Mobile,
//       email: item.user.Email,
//       realCash: item.user.RealCash,
//       bonus: item.user.Bonus,
//       coin: item.user.Coin,
//       createdAt: getDateInUTCToTimeZone(item.DateCreated)

export const columns = [
  // columnHelper.accessor((row) => row.id, {
  //   id: 'id',
  //   label: 'Referral ID',
  //   header: 'Referral ID',
  //   cell: IdCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'User Name',
    header: 'User Name',
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
  columnHelper.accessor((row) => row.email, {
    id: 'email',
    label: 'Email',
    header: 'Email',
    cell: BoldCell,
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
  columnHelper.accessor((row) => row.coin, {
    id: 'coin',
    header: 'Coin',
    label: 'Coin',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Date',
    header: 'Created At',
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
