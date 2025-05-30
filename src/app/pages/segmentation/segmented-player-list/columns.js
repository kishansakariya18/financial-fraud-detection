// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';
import {
  AmountCell,
  BadgeCell,
  BoldCell,
  DateCell,
  IdCell
} from '../../../../components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { playerStatusOptions } from 'app/pages/users/player/helper';
// import { CopyableCell } from 'components/shared/table/CopyableCell';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.userID, {
    id: 'userID',
    label: 'ID',
    header: 'User ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.userUID, {
    id: 'userUID',
    label: 'User UID',
    header: 'User UID',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'User Name',
    header: 'User Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.mobile, {
    id: 'mobile',
    label: 'Mobile',
    header: 'Mobile',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.email, {
    id: 'email',
    label: 'Email',
    header: 'Email',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.referralCode, {
    id: 'referralCode',
    label: 'Referral Code',
    header: 'Referral Code',
    cell: CopyableCell,
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.realCash, {
    id: 'realCash',
    label: 'Real Cash',
    header: 'Real Cash',
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
    meta: { optionData: playerStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),

  // columnHelper.accessor((row) => row.coin, {
  //   id: 'coin',
  //   label: 'Coin',
  //   header: 'Coin',
  //   cell: BoldCell,
  //   enableSorting: false
  // }),
  // columnHelper.accessor((row) => row.cryptoDeposit, {
  //   id: 'cryptoDeposit',
  //   label: 'Crypto Deposit',
  //   header: 'Crypto Deposit',
  //   cell: BoldCell,
  //   enableSorting: false
  // }),
  // columnHelper.accessor((row) => row.cryptoWinning, {
  //   id: 'cryptoWinning',
  //   label: 'Crypto Winning',
  //   header: 'Crypto Winning',
  //   cell: BoldCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.lastLoginAt, {
    id: 'lastLoginAt',
    label: 'Last Login',
    header: 'Last Login',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.isBankVerified, {
    id: 'isBankVerified',
    label: 'Bank Verified',
    header: 'Bank Verified',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Registration Date',
    header: 'Registration Date',
    cell: DateCell,
    enableSorting: false
  })
];
