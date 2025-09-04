import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor('NotificationLogID', {
    id: 'NotificationLogID',
    header: 'NotificationLogID',
    cell: (info) => info.getValue() || '-'
  }),
  columnHelper.accessor('Title', {
    id: 'Title',
    header: 'Title',
    cell: (info) => info.getValue() || '-'
  }),
  columnHelper.accessor('MsgBody', {
    id: 'MsgBody',
    header: 'MsgBody',
    cell: (info) => info.getValue() || '-'
  }),
  columnHelper.accessor('RecipientGroupType', {
    id: 'RecipientGroupType',
    header: 'RecipientGroupType',
    cell: (info) => info.getValue() || '-'
  })
];
