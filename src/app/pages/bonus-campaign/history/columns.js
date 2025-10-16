// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, AmountCell, BadgeCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { grantStatusOptions } from '../helper';
import { RowActions } from './RowActions';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

// Progress Cell Component
// const ProgressCell = ({ getValue }) => {
//   const value = getValue();
//   return (
//     <div className="flex items-center gap-2">
//       <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-dark-600">
//         <div
//           className="h-full bg-primary-600 transition-all"
//           style={{ width: `${Math.min(value, 100)}%` }}
//         />
//       </div>
//       <span className="text-xs font-medium">{value.toFixed(1)}%</span>
//     </div>
//   );
// };

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false,
    size: 80
  }),
  columnHelper.accessor((row) => row.userName, {
    id: 'username',
    label: 'User Name',
    header: 'User Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.mobile, {
    id: 'mobile',
    label: 'Mobile',
    header: 'Mobile',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.txnAmount, {
    id: 'txnAmount',
    label: 'Transaction Amount',
    header: 'Txn Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.grantBonusAmount, {
    id: 'grantBonusAmount',
    label: 'Bonus Amount',
    header: 'Bonus Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.grantStatus, {
    id: 'grantStatus',
    label: 'Grant Status',
    header: 'Status',
    cell: BadgeCell,
    meta: {
      optionData: grantStatusOptions,
      getOptionLabel: (value) =>
        grantStatusOptions.find((opt) => opt.value === value)?.label || value
    },
    enableSorting: false,
    enableColumnFilter: true
  }),
  columnHelper.accessor((row) => row.requiredWR, {
    id: 'requiredWR',
    label: 'Required Wagering',
    header: 'Required WR',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.completedWR, {
    id: 'completedWR',
    label: 'Completed Wagering',
    header: 'Completed WR',
    cell: AmountCell,
    enableSorting: false
  }),
  // columnHelper.accessor((row) => row.wageringProgress, {
  //   id: 'wageringProgress',
  //   label: 'Wagering Progress',
  //   header: 'WR Progress',
  //   cell: ProgressCell,
  //   enableSorting: false
  // }),
  columnHelper.accessor((row) => row.expireOn, {
    id: 'expireOn',
    label: 'Expires On',
    header: 'Expires On',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.dateCreated, {
    id: 'dateCreated',
    label: 'Created On',
    header: 'Created On',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.display({
    id: 'actions',
    label: 'Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false,
    size: 80
  })
];
