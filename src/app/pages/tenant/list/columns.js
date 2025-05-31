// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';
import { BadgeCell, DateCell, IdCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { servicesOptions, tenantStatusOptions } from '../helper';
import { RowActions } from './RowActions';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'Tenant ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.tenantUID, {
    id: 'tenantUID',
    label: 'Tenant UID',
    header: 'Tenant UID',
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

  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: tenantStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.service, {
    id: 'solutions',
    label: 'solutions',
    header: 'Solutions',
    cell: BadgeCell,
    meta: { optionData: servicesOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Registration Date',
    header: 'Registration Date',
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
