import { createColumnHelper } from '@tanstack/react-table';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell, BadgeCell } from '../../../../../components/custom/table/cell';
import { CopyableCell } from '../../../../../components/shared/table/CopyableCell';
import { statusOptions } from '../helper';
import { ensureString } from 'utils/ensureString';
import { Highlight } from 'components/shared/Highlight';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Supervisor ID',
    header: 'Supervisor ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.adminUID, {
    id: 'adminUID',
    label: 'Supervisor UID',
    header: 'Supervisor UID',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.username, {
    id: 'username',
    label: 'Username',
    header: 'User Name',
    cell: (info) => {
      const globalQuery = ensureString(info.table.getState().globalFilter);
      const columnQuery = ensureString(info.column.getFilterValue());
      const tooltip = info.row.original?.supervisorAccessTooltip;
      return (
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <span className="flex items-center gap-2 font-medium text-gray-800 dark:text-dark-100">
            <Highlight query={[globalQuery, columnQuery]}>
              {info.getValue() || 'not-found'}
            </Highlight>
            {!!tooltip && (
              <span className="text-warning" data-tooltip={true} data-tooltip-content={tooltip}>
                <ExclamationTriangleIcon className="size-4" />
              </span>
            )}
          </span>
        </div>
      );
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.firstname, {
    id: 'firstname',
    label: 'FirstName',
    header: 'First Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.lastname, {
    id: 'lastname',
    label: 'LastName',
    header: 'Last Name',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.assignedAgentsCount, {
    id: 'assignedAgentsCount',
    label: 'Agents Count',
    header: 'Agents Count',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.email, {
    id: 'email',
    header: 'email',
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
    label: 'Supervisor Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Supervisor Date',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.lastLoginAt, {
    id: 'lastLoginAt',
    label: 'Last Login At',
    header: 'Last Login At',
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
