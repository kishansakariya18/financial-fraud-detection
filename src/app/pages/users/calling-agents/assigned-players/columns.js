// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, BoldCell, BadgeCell, SelectCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { playerStatusOptions } from 'components/sections/player-management/helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const playerColumns = ({ selectedIds, handleCheck, actionLabel = 'Select' }) => {
  const columns = [
    columnHelper.accessor((row) => row.id, {
      id: 'id',
      label: 'User ID',
      header: 'User ID',
      cell: IdCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.username, {
      id: 'username',
      label: 'User Name',
      header: 'User Name',
      cell: BoldCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.userUID, {
      id: 'userUID',
      label: 'User UID',
      header: 'User UID',
      cell: CopyableCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.email, {
      id: 'email',
      header: 'Email',
      label: 'Email',
      cell: CopyableCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.mobile, {
      id: 'mobile',
      header: 'Phone',
      label: 'Phone',
      cell: CopyableCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.status, {
      id: 'status',
      label: 'Status',
      header: 'Status',
      cell: BadgeCell,
      meta: { optionData: playerStatusOptions },
      filterFn: 'arrIncludesSome',
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.createdAt, {
      id: 'createdAt',
      label: 'Created At',
      header: 'Created At',
      cell: DateCell,
      filterFn: 'inNumberRange',
      enableSorting: false
    })
  ];

  // Add select column for selection
  if (selectedIds !== undefined && handleCheck) {
    columns.unshift(
      columnHelper.display({
        id: 'select',
        label: actionLabel,
        header: actionLabel,
        cell: (cell) =>
          SelectCell({
            checked: selectedIds,
            row: cell.row,
            onChange: handleCheck,
            align: 'start'
          }),
        enableSorting: false
      })
    );
  }

  return columns;
};
