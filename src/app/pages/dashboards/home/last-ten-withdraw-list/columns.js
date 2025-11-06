import { createColumnHelper } from '@tanstack/react-table';
import { BaseCurrencyAmountCell, OneLineDateCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.Username, {
    id: 'username',
    label: 'Username',
    header: 'Username',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.TransactionAmount, {
    id: 'amount',
    label: 'Amount',
    header: 'Amount',
    cell: BaseCurrencyAmountCell,
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
