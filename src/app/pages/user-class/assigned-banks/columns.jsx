import { createColumnHelper } from '@tanstack/react-table';
import { BoldCell, SelectCell } from 'components/custom/table/cell';

export const bankColumns = ({ selectedIds, handleCheck }) => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.display({
      id: 'select',
      label: 'Select',
      header: 'Select',
      cell: (cell) =>
        SelectCell({ checked: selectedIds, row: cell.row, onChange: handleCheck, align: 'start' }),
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.BankName, {
      id: 'name',
      label: 'Bank Name',
      header: 'Bank Name',
      cell: BoldCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.AccountNumber, {
      id: 'accountNumber',
      label: 'Account Number',
      header: 'Account Number',
      cell: BoldCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.AccountHolderName, {
      id: 'accountHolderName',
      label: 'Account Holder Name',
      header: 'Account Holder Name',
      cell: BoldCell,
      enableSorting: false
    })
  ];
};
