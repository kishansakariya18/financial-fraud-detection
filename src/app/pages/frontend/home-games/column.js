// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, BadgeCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../components/shared/table/CopyableCell';
import { homeGameStatusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = ({ canShowActions } = {}) => [
  columnHelper.accessor((row) => row.gameId, {
    id: 'gameId',
    label: 'GameID',
    header: 'GameID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.gameName, {
    id: 'gameName',
    label: 'GameName',
    header: 'gameName',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: homeGameStatusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  ...(canShowActions
    ? [
        columnHelper.display({
          id: 'actions',
          label: 'Row Actions',
          header: 'Actions',
          cell: RowActions,
          enableSorting: false
        })
      ]
    : [])
];
