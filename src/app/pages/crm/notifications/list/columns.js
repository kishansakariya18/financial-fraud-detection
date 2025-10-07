import { createColumnHelper } from '@tanstack/react-table';
import { RowActions } from 'app/pages/crm/notifications/list/RowActions';
import { IdCell, BoldCell, DateCell, BadgeCell } from 'components/custom/table/cell';
import { statusOptions } from 'app/pages/crm/helper';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor('NotificationLogID', {
    id: 'id',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor('Title', {
    id: 'Title',
    header: 'Title',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor('MsgBody', {
    id: 'MsgBody',
    header: 'MsgBody',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor('RecipientGroupType', {
    id: 'RecipientGroupType',
    header: 'RecipientGroupType',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor('Channel', {
    id: 'Channel',
    header: 'Channel',
    cell: BoldCell,
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor('Type', {
    id: 'Type',
    header: 'Type',
    cell: BoldCell,
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor('DateCreated', {
    id: 'DateCreated',
    header: 'DateCreated',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor('DateModified', {
    id: 'DateModified',
    header: 'DateModified',
    cell: BoldCell,
    enableSorting: false
  }),
  // Hidden technical column used for date range filtering via DateFilter
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created At (ts)',
    header: 'Created At (ts)',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor('Status', {
    id: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    filterFn: 'arrIncludesSome',
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
