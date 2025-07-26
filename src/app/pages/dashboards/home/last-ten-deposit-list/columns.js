import { createColumnHelper } from '@tanstack/react-table';
import { AmountCell, OneLineDateCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.user.Username, {
    id: 'username',
    label: ' Username',
    header: 'username',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.RealCash, {
    id: 'amount',
    label: 'Amount',
    header: 'Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.DateCreated, {
    id: 'date',
    label: 'Date',
    header: 'Date',
    cell: OneLineDateCell,
    enableSorting: false
  })
];
