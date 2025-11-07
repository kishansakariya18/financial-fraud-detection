import { createColumnHelper } from '@tanstack/react-table';
import { IdCell, BadgeCell, AmountCell, OneLineDateCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Event ID',
    header: 'Event ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.eventName, {
    id: 'eventName',
    label: 'Event Name',
    header: 'Event Name',
    cell: BadgeCell,
    meta: {
      optionData: [
        { value: 'deposit', label: 'Deposit', color: 'success' },
        { value: 'wager', label: 'Wager', color: 'primary' },
        { value: 'loss', label: 'Loss', color: 'error' }
      ]
    },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.eventAmount, {
    id: 'eventAmount',
    header: 'Event Amount',
    label: 'Event Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.player?.userUID, {
    id: 'playerUserUID',
    header: 'Player Id',
    label: 'Player Id',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.player?.username, {
    id: 'playerUsername',
    header: 'Player Username',
    label: 'Player Username',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.player?.mobile, {
    id: 'playerMobile',
    header: 'Player Mobile',
    label: 'Player Mobile',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.eventDate, {
    id: 'eventDate',
    label: 'Event Date',
    header: 'Event Date',
    cell: OneLineDateCell,
    enableSorting: true
  })
];
