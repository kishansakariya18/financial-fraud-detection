// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, SelectCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';

// ----------------------------------------------------------------------

export const addHomeGameColumns = ({ selectedIds, handleCheck, actionLabel }) => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.display({
      id: 'select',
      label: actionLabel,
      header: actionLabel,
      cell: (cell) => SelectCell({ checked: selectedIds, row: cell.row, onChange: handleCheck }),
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.id, {
      id: 'id',
      label: 'GameID',
      header: 'Game ID',
      cell: IdCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.gameName, {
      id: 'gameName',
      label: 'Game Name',
      header: 'Game Name',
      cell: CopyableCell,
      enableSorting: false
    })
  ];
};
