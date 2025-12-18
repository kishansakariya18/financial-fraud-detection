// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, SelectCell } from '../../../../../components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

// ----------------------------------------------------------------------

export const gameColumns = ({ selectedIds, handleCheck, actionLabel }) => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.display({
      id: 'select',
      label: actionLabel,
      header: actionLabel,
      cell: (cell) =>
        SelectCell({ checked: selectedIds, row: cell.row, onChange: handleCheck, align: 'start' }),
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
      cell: CopyableCell,
      enableSorting: false
    })
  ];
};
