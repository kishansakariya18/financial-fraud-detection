// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { BadgeCell } from '../../../../components/custom/table/cell';
import { IdCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
import { emailProviderStatusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = ({ canShowActions } = {}) => [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Email Provider ID',
    header: 'Provider ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.uid, {
    id: 'uid',
    label: 'Email Provider UID',
    header: 'Provider UID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.provider, {
    id: 'providerName',
    label: 'Email Provider Name',
    header: 'Provider Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Provider Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: emailProviderStatusOptions },
    filterFn: 'arrIncludesSome',
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
