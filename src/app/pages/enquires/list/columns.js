// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, BoldCell, BadgeCell } from 'components/custom/table/cell';
import { RowActions } from './RowActions';
import { enquiresStatusOptions } from '../helper';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.title, {
    id: 'Name',
    header: 'Restriction Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.userName, {
    id: 'UserName',
    header: 'User Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.firstName, {
    id: 'First Name',
    header: 'First Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'Last Name',
    header: 'Last Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.email, {
    id: 'Email',
    header: 'Email',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.setBy, {
    id: 'Set By',
    header: 'Set By',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: enquiresStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'Created At',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.updatedAt, {
    id: 'Last Modified',
    header: 'Last Modified',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.approvedAt, {
    id: 'Approved At',
    header: 'Approved At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.expireAt, {
    id: 'ExpiresAt',
    header: 'Expires At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'action',
    header: 'Action',
    cell: RowActions,
    enableSorting: false
  })
];
