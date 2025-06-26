import { createColumnHelper } from '@tanstack/react-table';
import { BoldCell, IdCell, MultiLineCell, StatusIconCell } from 'components/custom/table/cell';
import { blockedProviderStatusOptions } from '../helper';
import { RowActions } from './RowActions';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.providerID, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.providerName, {
    id: 'providerName',
    label: 'Provider Name',
    header: 'Provider Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.isBlocked ? 'blocked' : 'active'), {
    id: 'isBlocked',
    label: 'Blocked?',
    header: 'Blocked?',
    cell: StatusIconCell,
    meta: { optionData: blockedProviderStatusOptions },
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
