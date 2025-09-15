// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import {
  IdCell,
  DateCell,
  BoldCell,
  BadgeCell
  // AmountCell
} from '../../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../../components/shared/table/CopyableCell';
import { playerStatusOptions, genderOptions } from '../helper';
import { panVerifiedOptions } from '../helper';
import { bankVerifiedOptions } from '../helper';

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
  // columnHelper.accessor((row) => row.realCash, {
  //   id: 'realCash',
  //   header: 'Real Cash',
  //   label: 'Real Cash',
  //   cell: AmountCell,
  //   enableSorting: false
  // }),
  // columnHelper.accessor((row) => row.bonus, {
  //   id: 'bonus',
  //   header: 'Bonus',
  //   label: 'Bonus',
  //   cell: AmountCell,
  //   enableSorting: false
  // }),
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
  columnHelper.accessor((row) => row.blockedAt, {
    id: 'blockedAt',
    label: 'Blocked At',
    header: 'Blocked At',
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
  }),
  columnHelper.accessor((row) => row.isBankVerified, {
    id: 'isBankVerified',
    label: 'Bank Verified',
    header: 'Bank Verified',
    cell: BoldCell,
    meta: { optionData: bankVerifiedOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.gender, {
    id: 'gender',
    label: 'Gender',
    header: 'Gender',
    cell: BoldCell,
    meta: { optionData: genderOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.isKYCVerified, {
    id: 'isKYCVerified',
    label: 'KYC Verified',
    header: 'KYC Verified',
    cell: BoldCell,
    meta: { optionData: panVerifiedOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CountryID, {
    id: 'CountryID',
    label: 'Country',
    header: 'Country',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.SegmentationID, {
    id: 'SegmentationID',
    label: 'Segmentation ID',
    header: 'Segmentation ID',
    cell: BoldCell,
    enableSorting: false
  }),
  // Virtual/display column for Player Class filter support (server-side filtering)
  columnHelper.display({
    id: 'playerClassID',
    label: 'Player Class',
    header: 'Player Class',
    cell: BoldCell,
    enableSorting: false
  })
  // columnHelper.accessor((row) => row.SegmentationID, {
  //   id: 'SegmentationID',
  //   label: 'Segmentation ID',
  //   header: 'Segmentation ID',
  //   cell: BoldCell,
  //   enableSorting: false
  // })
];
