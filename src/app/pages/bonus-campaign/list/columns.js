import { createColumnHelper } from '@tanstack/react-table';
import { BoldCell, BadgeCell, DateCell, IdCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { RowActions } from './RowActions';
import { campaignStatusOptions, campaignTypeOptions, claimMethodOptions } from '../helper';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false,
    size: 80
  }),
  columnHelper.accessor((row) => row.campaignCode, {
    id: 'campaignCode',
    label: 'Campaign Code',
    header: 'Campaign Code',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.campaignName, {
    id: 'campaignName',
    label: 'Campaign Name',
    header: 'Campaign Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.campaignType, {
    id: 'campaignType',
    label: 'Campaign Type',
    header: 'Type',
    cell: BadgeCell,
    meta: {
      optionData: campaignTypeOptions,
      getOptionLabel: (value) =>
        campaignTypeOptions.find((opt) => opt.value === value)?.label || value
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.claimMethod, {
    id: 'claimMethod',
    label: 'Claim Method',
    header: 'Claim Method',
    cell: BadgeCell,
    meta: {
      optionData: claimMethodOptions,
      getOptionLabel: (value) =>
        claimMethodOptions.find((opt) => opt.value === value)?.label || value
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.startDate, {
    id: 'startDate',
    label: 'Start Date',
    header: 'Start Date',
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
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: {
      optionData: campaignStatusOptions,
      getOptionLabel: (value) =>
        campaignStatusOptions.find((opt) => opt.value === value)?.label || value
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.totalRedemptionsUsed, {
    id: 'redemptions',
    label: 'Redemptions',
    header: 'Redemptions',
    cell: (info) => `${info.getValue()} / ${info.row.original.totalMaxRedemptions || '∞'}`,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.bonusValue, {
    id: 'bonusValue',
    label: 'Bonus Value',
    header: 'Bonus',
    cell: (info) => {
      const value = info.getValue();
      const row = info.row.original;
      return row.bonusType === 1 ? `${value}% (Min. ${row.minDepositAmount})` : value;
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.wageringMultiplier, {
    id: 'wagering',
    label: 'Wagering',
    header: 'Wagering',
    cell: (info) => `${info.getValue()}x`,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.dateCreated, {
    id: 'dateCreated',
    label: 'Created On',
    header: 'Created On',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.display({
    id: 'actions',
    label: 'Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false,
    size: 120
  })
];
