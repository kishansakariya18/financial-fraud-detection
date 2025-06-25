// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import {
  IdCell,
  BadgeCell,
  BoldCell,
  MultiLineCell
} from '../../../../components/custom/table/cell';
import { globallyBlockedStatusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Country ID',
    header: 'Country ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.countryName, {
    id: 'countryName',
    label: 'Country Name',
    header: 'Country Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.countryCode, {
    id: 'contryCode',
    label: 'Country Code',
    header: 'Country Code',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.globallyBlocked ? 'blocked' : 'not_blocked'), {
    id: 'globallyBlocked',
    label: 'Globally Blocked?',
    header: 'Globally Blocked?',
    cell: BadgeCell,
    meta: { optionData: globallyBlockedStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),

  columnHelper.accessor((row) => row.blockedModules, {
    id: 'blockedModules',
    label: 'Blocked Modules',
    header: 'Blocked Modules',
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
