import { createColumnHelper } from '@tanstack/react-table';
import { AmountCell, DateCell, IdCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const columnHelper = createColumnHelper();
export const columns = [
  columnHelper.accessor((row) => row.AffiliateCommissionBalanceID, {
    id: 'AffiliateCommissionBalanceID',
    header: 'Commission ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CurrencyCode, {
    id: 'Currency',
    header: 'Currency',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.AvailableCommission, {
    id: 'AvailableCommission',
    header: 'Available Commission',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.WithdrawnCommission, {
    id: 'WithdrawnCommission',
    header: 'Withdrawn Commission',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.LifetimeCommission, {
    id: 'LifetimeCommission',
    header: 'Lifetime Commission',
    cell: AmountCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => getDateInUTCToTimeZone(row.DateCreated), {
    id: 'DateCreated',
    header: 'Created At',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => getDateInUTCToTimeZone(row.DateUpdated), {
    id: 'DateUpdated',
    header: 'Updated At',
    cell: DateCell,
    enableSorting: false
  })
];
