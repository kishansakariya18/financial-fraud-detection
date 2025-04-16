// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, BoldCell, SelectCell } from '../../../../../components/custom/table/cell';

// ----------------------------------------------------------------------

export const countryColumns = ({ selectedIds, handleCheck }) => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.display({
      id: 'select',
      label: 'Remove',
      header: 'Remove',
      cell: (cell) => SelectCell({ checked: selectedIds, row: cell.row, onChange: handleCheck }),
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.id, {
      id: 'id',
      label: 'ID',
      header: 'ID',
      cell: IdCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      label: 'Name',
      header: 'Name',
      cell: BoldCell,
      enableSorting: false
    })
  ];
};
