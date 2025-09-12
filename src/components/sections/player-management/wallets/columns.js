// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

import { BoldCell, AmountCell, IdCell } from 'components/custom/table/cell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Wallet ID',
    header: 'Wallet ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.code, {
    id: 'currencyCode',
    label: 'Currency Code',
    header: 'Currency Code',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'currencyName',
    label: 'Currency Name',
    header: 'Currency Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.realCashAmount, {
    id: 'realCash',
    header: 'Real Cash',
    label: 'Real Cash',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.bonusAmount, {
    id: 'bonus',
    header: 'Bonus',
    label: 'Bonus',
    cell: AmountCell,
    enableSorting: false
  })
  // columnHelper.accessor((row) => row.totalAmount, {
  //   id: 'totalAmount',
  //   header: 'Total Amount',
  //   label: 'Total Amount',
  //   cell: AmountCell,
  //   enableSorting: false
  // }),
  // columnHelper.accessor((row) => row.status, {
  //   id: 'status',
  //   label: 'Status',
  //   header: 'Status',
  //   cell: BadgeCell,
  //   meta: {
  //     optionData: [
  //       { value: 'active', label: 'Active', color: 'success' },
  //       { value: 'inactive', label: 'Inactive', color: 'error' },
  //       { value: 'frozen', label: 'Frozen', color: 'warning' }
  //     ]
  //   },
  //   filterFn: 'arrIncludesSome',
  //   enableSorting: false
  // }),
  // columnHelper.display({
  //   id: 'actions',
  //   label: 'Row Actions',
  //   header: 'Actions',
  //   cell: RowActions,
  //   enableSorting: false
  // })
];
