import { createColumnHelper } from '@tanstack/react-table';
import { BoldCell, IdCell, MultiLineCell, StatusIconCell } from 'components/custom/table/cell';
import { blockedModuleStatusOptions } from '../helper';
import { RowActions } from './RowActions';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.moduleID, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.moduleName, {
    id: 'moduleName',
    label: 'Module Name',
    header: 'Module Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.isBlocked ? 'blocked' : 'active'), {
    id: 'isBlocked',
    label: 'Blocked?',
    header: 'Blocked?',
    cell: StatusIconCell,
    meta: { optionData: blockedModuleStatusOptions },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.restrictionReason, {
    id: 'restrictionReason',
    label: 'Restriction Reason',
    header: 'Restriction Reason',
    cell: MultiLineCell,
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
