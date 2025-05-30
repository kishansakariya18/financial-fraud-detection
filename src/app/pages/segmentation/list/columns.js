import { createColumnHelper } from '@tanstack/react-table';
import { BoldCell, BadgeCell, DateCell } from '../../../../components/custom/table/cell';
import { segmentationStatusOptions } from '../helper';
import { RowActions } from './RowActions';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    header: 'ID',
    cell: BoldCell, // Use IdCell if you have a specific one
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: 'Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdByAdmin, {
    id: 'createdByAdmin',
    header: 'Created By Admin',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.count, {
    id: 'count',
    header: 'User Count',
    cell: BoldCell, // plain value or wrap in AmountCell etc.
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    header: 'Status',
    meta: { optionData: segmentationStatusOptions },
    cell: BadgeCell, // Assuming you use BadgeCell for status display
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    header: 'Created At',
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
