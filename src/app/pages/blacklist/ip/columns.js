import { createColumnHelper } from '@tanstack/react-table';
import { BoldCell, IdCell, DateCell } from 'components/custom/table/cell';
import RowActions from './RowActions';

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
    label: 'IP Address',
    header: 'IP Address',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.blockType, {
    id: 'ipType',
    label: 'IP Type',
    header: 'IP Type',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.reason, {
    id: 'reason',
    label: 'Reason',
    header: 'Reason',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'blacklistedAt',
    label: 'Blacklisted At',
    header: 'Blacklisted At',
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
