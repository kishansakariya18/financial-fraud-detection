import { createColumnHelper } from '@tanstack/react-table';

import { RowActions } from './RowActions';
import { IdCell, DateCell, BadgeCell } from 'components/custom/table/cell';
import { moduleOptions, faqStatusOption } from '../helper';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id || 'id', {
    id: 'id',
    label: 'FAQ UID',
    header: 'FAQ UID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.question || 'question', {
    id: 'question',
    label: 'Question',
    header: 'Question',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.module || '', {
    id: 'module',
    label: 'Module',
    header: 'Module',
    cell: BadgeCell,
    meta: { optionData: moduleOptions },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.status || 'inactive', {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: faqStatusOption },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created Date',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'actions',
    label: 'Row Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
