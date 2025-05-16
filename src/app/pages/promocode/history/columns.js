// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { IdCell, DateCell, AmountCell } from '../../../../components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
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
  columnHelper.accessor((row) => row.depositAmount, {
    id: 'depositAmount',
    label: 'Deposit Amount',
    header: 'Deposit Amount',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.benefitAmount, {
    id: 'benefitAmount',
    label: 'Benefit Amount',
    header: 'Benefit Amount',
    cell: AmountCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.usedAt, {
    id: 'usedAt',
    label: 'Used At',
    header: 'Used At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  })
];
