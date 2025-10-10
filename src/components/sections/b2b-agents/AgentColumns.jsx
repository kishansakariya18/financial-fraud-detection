import { createColumnHelper } from '@tanstack/react-table';

import { AgentRowActions } from './AgentRowActions';
import { statusOptions, agentTypeOptions } from 'components/sections/b2b-agents/helper';
import { ensureString } from 'utils/ensureString';
import { Highlight } from 'components/shared/Highlight';
import { IdCell, BoldCell, BadgeCell, DateCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const createAgentColumns = ({ onViewAgent, onEditAgent, onChangeAgentStatus }) => {
  console.log('onViewAgent', onViewAgent);
  console.log('onEditAgent', onEditAgent);
  console.log('onChangeAgentStatus', onChangeAgentStatus);
  return [
    columnHelper.accessor((row) => row.id, {
      id: 'id',
      label: 'Agent ID',
      header: 'Agent ID',
      cell: IdCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.agentUID, {
      id: 'agentUID',
      label: 'Agent UID',
      header: 'Agent UID',
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
        return (
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <span className="flex items-center gap-2 font-medium text-gray-800 dark:text-dark-100">
              <Highlight query={[globalQuery, columnQuery]}>
                {info.getValue() || 'not-found'}
              </Highlight>
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
    columnHelper.accessor((row) => row.agentType, {
      id: 'agentType',
      label: 'Agent Type',
      header: 'Agent Type',
      cell: BadgeCell,
      meta: { optionData: agentTypeOptions },
      filterFn: 'arrIncludesSome',
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.phoneCode + row.mobile, {
      id: 'phone',
      label: 'Phone',
      header: 'Phone',
      cell: CopyableCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.email, {
      id: 'email',
      header: 'email',
      label: 'Email',
      cell: CopyableCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.status, {
      id: 'status',
      label: 'Agent Status',
      header: 'Status',
      cell: BadgeCell,
      meta: { optionData: statusOptions },
      filterFn: 'arrIncludesSome',
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.createdAt, {
      id: 'createdAt',
      label: 'Agent Date',
      header: 'Created At',
      cell: DateCell,
      filterFn: 'inNumberRange',
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.loginCount, {
      id: 'loginCount',
      label: 'Login Count',
      header: 'Login Count',
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
      cell: (props) => (
        <AgentRowActions
          {...props}
          onViewAgent={onViewAgent}
          onEditAgent={onEditAgent}
          onChangeAgentStatus={onChangeAgentStatus}
        />
      ),
      enableSorting: false
    })
  ];
};
