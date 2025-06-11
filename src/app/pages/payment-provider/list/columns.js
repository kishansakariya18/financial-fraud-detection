// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
// import { IdCell, DateCell, BadgeCell } from '../../../../components/custom/table/cell';
import { BadgeCell } from '../../../../components/custom/table/cell';
import { IdCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
import { providerStatusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Payment Provider ID',
    header: 'Payment Provider ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.gatewayName, {
    id: 'gatewayName',
    label: 'Payment Provider Name',
    header: 'Payment Provider Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Provider Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: providerStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.eventName, {
  //   id: 'eventName',
  //   label: 'Event Name',
  //   header: 'Event Name',
  //   cell: CopyableCell,
  //   enableSorting: false
  // }),
  // columnHelper.accessor((row) => row.username, {
  //   id: 'username',
  //   label: 'Username',
  //   header: 'Username',
  //   cell: CopyableCell,
  //   enableSorting: false
  // }),
  // columnHelper.accessor((row) => row.createdAt, {
  //   id: 'createdAt',
  //   label: 'Created Date',
  //   header: 'Created At',
  //   cell: DateCell,
  //   filterFn: 'inNumberRange',
  //   enableSorting: false
  // }),
  columnHelper.display({
    id: 'actions',
    label: 'Row Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
