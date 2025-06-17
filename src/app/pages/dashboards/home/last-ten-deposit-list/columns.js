import { createColumnHelper } from '@tanstack/react-table';
import { AmountCell, IdCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.TransactionID, {
    id: 'trasnsactionID',
    label: 'Transaction ID',
    header: 'Transaction ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.user.Username, {
    id: 'name',
    label: 'Name',
    header: 'Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.RealCash, {
    id: 'realCash',
    label: 'Real Cash',
    header: 'Real Cash',
    cell: AmountCell,
    enableSorting: false
  })
];
