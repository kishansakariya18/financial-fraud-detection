import { createColumnHelper } from '@tanstack/react-table';
import { EyeIcon } from '@heroicons/react/24/outline';

import { IdCell, BoldCell, SelectCell } from 'components/custom/table/cell';
import { Button } from 'components/ui';
import { ADMIN_TYPE } from 'constants/app.constant';

// ----------------------------------------------------------------------

export const assignedPlayersColumns = ({
  selectedIds,
  handleCheck,
  actionLabel,
  showActions = true,
  userType = ADMIN_TYPE.AGENT,
  callingAgentUID,
  navigate
}) => {
  const columnHelper = createColumnHelper();

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
      label: 'Username',
      header: 'Username',
      cell: BoldCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.email, {
      id: 'email',
      label: 'Email',
      header: 'Email',
      cell: BoldCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.mobile, {
      id: 'mobile',
      label: 'Mobile',
      header: 'Mobile',
      cell: BoldCell,
      enableSorting: false
    }),
    columnHelper.display({
      id: 'actions',
      label: 'Actions',
      header: 'Actions',
      cell: (cell) => {
        const userUID = cell.row.original.userUID;

        const handleViewDetails = () => {
          if (userType === ADMIN_TYPE.AGENT) {
            navigate(`/calling-agents/assigned-players-details/${userUID}/tab/details`);
          } else {
            navigate(`/users/player/${userUID}/${callingAgentUID}/tab/details`);
          }
        };

        return (
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleViewDetails}
              className="h-8 w-8 p-0"
              title="View Details">
              <EyeIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false
    })
  ];

  // Add select column for admin users (they can assign/unassign)
  if (showActions && selectedIds !== undefined && handleCheck) {
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
