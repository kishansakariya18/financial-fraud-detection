import { Checkbox } from 'components/ui';

export const bankColumns = ({ handleCheck, selectedIds }) => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={(e) => {
          const isChecked = e.target.checked;
          const page = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          const originalData = table.options.meta.data;
          const ids = originalData.slice(page * pageSize, (page + 1) * pageSize).map((d) => d.id);
          handleCheck(ids, isChecked);
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={selectedIds.includes(row.original.id)}
        onChange={() => handleCheck([row.original.id])}
      />
    )
  },
  {
    header: 'Bank Name',
    accessorKey: 'bankName'
  },
  {
    header: 'Account Number',
    accessorKey: 'accountNumber'
  },
  {
    header: 'Account Holder',
    accessorKey: 'accountHolderName'
  }
];
