// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, BoldCell, BadgeCell } from 'components/custom/table/cell';
import { RowActions } from './RowActions';
import { campaignStatusOptions } from '../helper';

const columnHelper = createColumnHelper();

export const columns = ({ canShowActions }) => [
  columnHelper.accessor((row) => row.id, {
    id: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'Name',
    header: 'Campaign Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: campaignStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.promotionsCount, {
    id: 'Promotions',
    header: 'Promotions',
    cell: (info) => info.getValue() || 0,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.startDate, {
    id: 'Start Date',
    header: 'Start Date',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.endDate, {
    id: 'End Date',
    header: 'End Date',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.tags, {
    id: 'Tags',
    header: 'Tags',
    enableColumnFilter: true,
    filterFn: 'arrIncludesSome',
    enableSorting: false,
    meta: { isVisible: false }
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'Created At',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  ...(canShowActions
    ? [
        columnHelper.display({
          id: 'actions',
          header: 'Actions',
          cell: RowActions,
          enableSorting: false
        })
      ]
    : [])
];
