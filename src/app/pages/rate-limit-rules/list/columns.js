// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, DateCell, BadgeCell, BoldCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
import { statusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = ({ canShowActions } = {}) => [
  columnHelper.accessor((row) => row.rateLimitID, {
    id: 'rateLimitID',
    label: 'Rate Limit ID',
    header: 'Rate Limit ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.rateLimitUID, {
    id: 'rateLimitUID',
    label: 'RateLimit UID',
    header: 'RateLimit UID',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.label, {
    id: 'label',
    label: 'Action',
    header: 'Action',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.blockMinutes, {
    id: 'blockMinutes',
    label: 'Block Minutes',
    header: 'Block Minutes',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.windowMinutes, {
    id: 'windowMinutes',
    label: 'Window Minutes',
    header: 'Window Minutes',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.maxAttempts, {
    id: 'maxAttempts',
    header: 'Max Attempts',
    label: 'Max Attempts',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.description, {
    id: 'description',
    header: 'Description',
    label: 'Description',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.isActive, {
    id: 'isActive',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.dateModified, {
    id: 'dateModified',
    label: 'Last Modified At',
    header: 'Last Modified At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  ...(canShowActions
    ? [
        columnHelper.display({
          id: 'actions',
          label: 'Row Actions',
          header: 'Actions',
          cell: RowActions,
          enableSorting: false
        })
      ]
    : [])
];
