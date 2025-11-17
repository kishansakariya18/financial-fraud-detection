// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

import { statusOptions } from 'app/pages/casino-management/games/helper';
import { BadgeCell, BoldCell, DateCell, IdCell } from 'components/custom/table/cell';
import { Checkbox } from 'components/ui';

const columnHelper = createColumnHelper();

export const gameSelectionModalColumns = ({ selectedIds, handleCheck, onTogglePageSelection }) => [
  columnHelper.display({
    id: 'select',
    label: 'Select',
    header: ({ table }) => {
      const currentRowIds = table.getRowModel().rows.map((row) => row.original.id);
      const hasRows = currentRowIds.length > 0;
      const allSelectedOnPage = hasRows && currentRowIds.every((id) => selectedIds.includes(id));
      const someSelectedOnPage =
        hasRows && !allSelectedOnPage && currentRowIds.some((id) => selectedIds.includes(id));
      return (
        <div className="flex items-center justify-start">
          <Checkbox
            className="size-4.5"
            aria-label="Select all games on this page"
            checked={allSelectedOnPage}
            indeterminate={someSelectedOnPage}
            disabled={!table.getRowModel().rows.length}
            onChange={() => onTogglePageSelection?.(table)}
          />
        </div>
      );
    },
    size: 60,
    cell: (cell) => {
      const checked = selectedIds?.includes(cell.row.original.id);
      const disabled = !cell.row.getCanSelect();
      const indeterminate = cell.row.getIsSomeSelected();
      return (
        <div className="flex items-center justify-start">
          <Checkbox
            className="size-4.5"
            checked={checked}
            disabled={disabled}
            indeterminate={indeterminate}
            onChange={() => handleCheck(cell.row.original)}
          />
        </div>
      );
    },
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
  }),
  columnHelper.accessor((row) => row.provider, {
    id: 'provider',
    label: 'Provider',
    header: 'Provider',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created Date',
    header: 'Created Date',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  })
];
