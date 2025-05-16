// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
// import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell } from '../../../../components/custom/table/cell';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.srn, {
    id: 'srn',
    label: 'Sr. No.',
    header: 'Sr. No.',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Username',
    header: 'Username',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.moduleName, {
    id: 'moduleName',
    label: 'Module Name',
    header: 'Module Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.eventName, {
    id: 'eventName',
    label: 'Event Name',
    header: 'Event Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created Date',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  })
];
