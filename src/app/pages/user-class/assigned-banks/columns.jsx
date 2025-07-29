import { Checkbox } from 'components/ui';

export const bankColumns = ({ selectedIds = [], handleCheck }) => [
  {
    id: 'select',
    header: () => (
      <Checkbox
        checked={selectedIds.length > 0}
        indeterminate={selectedIds.length > 0}
        onChange={() => {}}
      />
    ),
    cell: ({ row }) => {
      console.log('Row data:', row.original);
      const id =
        row.original.DepositBankAccountID ||
        row.original.DepositBankAccountID ||
        row.original.DepositBankAccountID;
      if (!id) {
        console.error('No ID found in row data:', row.original);
      }
      return <Checkbox checked={selectedIds.includes(id)} onChange={() => handleCheck(id)} />;
    }
  },
  {
    header: 'Bank Name',
    accessorKey: 'BankName'
  },
  {
    header: 'Account Number',
    accessorKey: 'AccountNumber'
  },
  {
    header: 'Account Holder',
    accessorKey: 'AccountHolderName'
  }
];
