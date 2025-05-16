// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
<<<<<<< HEAD
// import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell } from '../../../../components/custom/table/cell';
=======
import { RowActions } from './RowActions';
import { IdCell, DateCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
>>>>>>> 7d7603a60decf0f5b95da914b43d9399e527fcbc

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
<<<<<<< HEAD
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
=======
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Audit Log ID',
    header: 'Audit Log ID',
    cell: IdCell,
    enableSorting: false
  }),
>>>>>>> 7d7603a60decf0f5b95da914b43d9399e527fcbc
  columnHelper.accessor((row) => row.moduleName, {
    id: 'moduleName',
    label: 'Module Name',
    header: 'Module Name',
<<<<<<< HEAD
    cell: BoldCell,
=======
    cell: CopyableCell,
>>>>>>> 7d7603a60decf0f5b95da914b43d9399e527fcbc
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.eventName, {
    id: 'eventName',
    label: 'Event Name',
    header: 'Event Name',
<<<<<<< HEAD
    cell: BoldCell,
=======
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Username',
    header: 'Username',
    cell: CopyableCell,
>>>>>>> 7d7603a60decf0f5b95da914b43d9399e527fcbc
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created Date',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
<<<<<<< HEAD
=======
  }),
  columnHelper.display({
    id: 'actions',
    label: 'Row Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
>>>>>>> 7d7603a60decf0f5b95da914b43d9399e527fcbc
  })
];
