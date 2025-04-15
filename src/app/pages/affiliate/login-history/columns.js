// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

import { IdCell, DateCell, BoldCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.ip, {
    id: 'ip',
    label: 'IP',
    header: 'IP Address',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.userAgent, {
    id: 'userAgent',
    label: 'User Agent',
    header: 'User Agent',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.loginAt, {
    id: 'loginAt',
    header: 'Login At',
    label: 'Login At',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.expiredAt, {
    id: 'expiredAt',
    header: 'Logout At',
    label: 'Logout At',
    cell: DateCell,
    enableSorting: false
  })
];
