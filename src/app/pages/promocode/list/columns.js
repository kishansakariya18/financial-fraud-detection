import { createColumnHelper } from '@tanstack/react-table';
import { BoldCell, BadgeCell, DateCell, IdCell, AmountCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { RowActions } from './RowActions';
import { promocodeStateOptions, promocodeStatusOptions } from '../helper';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.promoCodeName, {
    id: 'promocode',
    label: 'Promo Code Name',
    header: 'Promo Code Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.type, {
    id: 'type',
    label: 'Type',
    header: 'Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.discountType, {
    id: 'discountType',
    label: 'Discount Type',
    header: 'Discount Type',
    cell: BoldCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.segmentationType, {
  //   id: 'segmentationType',
  //   label: 'Segmentation Type',
  //   header: 'Segmentation Type',
  //   cell: BoldCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.currency, {
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
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created At',
    header: 'Created At',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.endDate, {
    id: 'endDate',
    label: 'End Date',
    header: 'End Date',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.visibility, {
    id: 'visibility',
    label: 'Visibility',
    header: 'Visibility',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.firstDepositOnly, {
    id: 'firstDeposit',
    label: 'First Deposit',
    header: 'First Deposit',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.secondDepositOnly, {
    id: 'secondDeposit',
    label: 'Second Deposit',
    header: 'Second Deposit',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: promocodeStatusOptions },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.state, {
    id: 'state',
    label: 'PromoCode State',
    header: 'PromoCode State',
    meta: { optionData: promocodeStateOptions },
    cell: BadgeCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.hasUserSegmentation, {
  //   id: 'hasUserSegmentation',
  //   label: 'User Segmentation',
  //   header: 'User Segmentation',
  //   cell: BadgeCell,
  //   enableSorting: false
  // }),
  // columnHelper.accessor((row) => row.firstDepositOnly, {
  //   id: 'firstDepositOnly',
  //   label: 'First Deposit Only',
  //   header: 'First Deposit Only',
  //   cell: BadgeCell,
  //   enableSorting: false
  // }),
  columnHelper.display({
    id: 'actions',
    label: 'Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
