import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.Username, {
    id: 'name',
    label: 'Name',
    header: 'Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.DateCreated, {
    id: 'creationDate',
    label: 'Creation Date',
    header: 'Creation Date',
    cell: DateCell,
    enableSorting: false
  })
];
