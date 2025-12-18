import { createColumnHelper } from '@tanstack/react-table';
import { BadgeCell, DateCell } from 'components/custom/table/cell';
import { bonusTemplateStatusOptions } from '../happer';
import { BonusTemplateRowActions } from 'components/sections/bonus-template/BonusTemplateRowActions';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

// Using shared DateCell for consistent formatting across modules

export const createBonusTemplateColumns = ({
  onView,
  onEdit,
  onDelete,
  onChangeStatus,
  onDuplicate
}) => [
  columnHelper.accessor('id', {
    id: 'id',
    header: 'ID',
    label: 'ID',
    cell: (info) => <span className="font-medium text-gray-700">{info.getValue() || '—'}</span>,
    enableSorting: false,
    size: 120
  }),
  columnHelper.accessor('templateName', {
    id: 'templateName',
    header: 'Template Name',
    label: 'Template Name',
    cell: (info) => <CopyableCell getValue={info.getValue} table={info.table} highlight={true} />,
    enableSorting: false,
    size: 220
  }),
  columnHelper.accessor('displayTitle', {
    id: 'displayTitle',
    header: 'Display Title',
    label: 'Display Title',
    cell: (info) => <CopyableCell getValue={info.getValue} table={info.table} highlight={true} />,
    enableSorting: false,
    size: 200
  }),
  columnHelper.accessor('bonusType', {
    id: 'bonusType',
    header: 'Bonus Type',
    label: 'Bonus Type',
    cell: (info) => info.getValue() || '—',
    enableSorting: false,
    size: 180
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    label: 'Status',
    cell: BadgeCell,
    meta: { optionData: bonusTemplateStatusOptions },
    enableSorting: false,
    size: 150
  }),
  columnHelper.accessor('updatedAt', {
    id: 'updatedAt',
    header: 'Last Updated',
    label: 'Last Updated',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false,
    size: 200
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    label: 'Actions',
    cell: (props) => (
      <BonusTemplateRowActions
        {...props}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onChangeStatus={onChangeStatus}
        onDuplicate={onDuplicate}
      />
    ),
    enableSorting: false,
    size: 120
  })
];
