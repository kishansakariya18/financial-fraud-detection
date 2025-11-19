import { createColumnHelper } from '@tanstack/react-table';
import { BadgeCell } from 'components/custom/table/cell';
import { PlayerSegmentationRowActions } from './RowActions';

const columnHelper = createColumnHelper();

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

export const playerSegmentationColumns = ({ canShowActions }) => [
  columnHelper.accessor('id', {
    id: 'id',
    header: 'ID',
    enableSorting: false,
    size: 120
  }),
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Name',
    enableSorting: false,
    size: 220
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    cell: BadgeCell,
    meta: {
      optionData: [
        { value: 1, label: 'Active', color: 'success' },
        { value: 0, label: 'Inactive', color: 'error' }
      ]
    },
    enableSorting: false,
    size: 150
  }),
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    header: 'Created At',
    cell: (info) => formatDate(info.getValue()),
    enableSorting: false,
    size: 200
  }),
  ...(canShowActions
    ? [
        columnHelper.display({
          id: 'actions',
          header: 'Actions',
          cell: (props) => <PlayerSegmentationRowActions {...props} />,
          enableSorting: false,
          size: 120
        })
      ]
    : [])
];
