import { createColumnHelper } from '@tanstack/react-table';
import { BadgeCell, DateCell } from 'components/custom/table/cell';
import { PlayerSegmentationRowActions } from './RowActions';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const playerSegmentationColumns = ({ canShowActions }) => [
  columnHelper.accessor('id', {
    id: 'id',
    header: 'ID',
    label: 'ID',
    enableSorting: false,
    size: 80
  }),
  columnHelper.accessor('segmentName', {
    id: 'segmentName',
    header: 'Segment Name',
    label: 'Segment Name',
    cell: CopyableCell,
    enableSorting: false,
    size: 200
  }),
  columnHelper.accessor('segmentTag', {
    id: 'segmentTag',
    header: 'Tag',
    label: 'Tag',
    cell: CopyableCell,
    enableSorting: false,
    size: 140
  }),
  columnHelper.accessor('isScheduled', {
    id: 'isScheduled',
    header: 'Scheduled',
    label: 'Scheduled',
    cell: BadgeCell,
    meta: {
      optionData: [
        { value: true, label: 'Yes', color: 'success' },
        { value: false, label: 'No', color: null }
      ]
    },
    enableSorting: false,
    size: 100
  }),
  columnHelper.accessor('evaluationFrequency', {
    id: 'evaluationFrequency',
    header: 'Frequency',
    label: 'Frequency',
    cell: BadgeCell,
    meta: {
      optionData: [
        { value: 'NONE', label: 'None', color: null },
        { value: 'HOURLY', label: 'Hourly', color: null },
        { value: 'DAILY', label: 'Daily', color: null },
        { value: 'WEEKLY', label: 'Weekly', color: null },
        { value: 'MONTHLY', label: 'Monthly', color: null }
      ]
    },
    enableSorting: false,
    size: 120
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    label: 'Status',
    cell: BadgeCell,
    meta: {
      optionData: [
        { value: 'active', label: 'Active', color: 'success' },
        { value: 'inactive', label: 'Inactive', color: 'error' },
        { value: 'archived', label: 'Archived', color: 'warning' }
      ]
    },
    enableSorting: false,
    size: 100
  }),
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    header: 'Created At',
    label: 'Created At',
    cell: DateCell,
    enableSorting: false,
    size: 160
  }),
  ...(canShowActions
    ? [
        columnHelper.display({
          id: 'actions',
          header: 'Actions',
          label: 'Actions',
          cell: (props) => <PlayerSegmentationRowActions {...props} />,
          enableSorting: false,
          size: 100
        })
      ]
    : [])
];
