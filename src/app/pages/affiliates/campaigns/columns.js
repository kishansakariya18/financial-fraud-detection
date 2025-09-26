import { createColumnHelper } from '@tanstack/react-table';
import { BoldCell, DateCell, IdCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const columnHelper = createColumnHelper();
export const columns = [
  columnHelper.accessor((row) => row.campaignStats.CampaignID, {
    id: 'CampaignID',
    header: 'Campaign ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CampaignName, {
    id: 'CampaignName',
    header: 'Campaign Name',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CampaignLink, {
    id: 'CampaignLink',
    header: 'Campaign Link',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => getDateInUTCToTimeZone(row.DateCreated), {
    id: 'DateCreated',
    header: 'Created At',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => (row.campaignStats?.Hits ? row.campaignStats?.Hits : '0'), {
    id: 'Hits',
    header: 'Hits',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor(
    (row) => (row.campaignStats?.ReferredUsers ? row.campaignStats?.ReferredUsers : '0'),
    {
      id: 'ReferredUsers',
      header: 'Referred Users',
      cell: BoldCell,
      enableSorting: false
    }
  ),
  columnHelper.accessor(
    (row) => (row.campaignStats?.FirstTimeDeposits ? row.campaignStats?.FirstTimeDeposits : '0'),
    {
      id: 'FirstTimeDeposits',
      header: 'First Time Deposits',
      cell: BoldCell,
      enableSorting: false
    }
  ),
  columnHelper.accessor(
    (row) => (row.campaignStats?.TotalDeposits ? row.campaignStats?.TotalDeposits : '0'),
    {
      id: 'TotalDeposits',
      header: 'Total Deposits',
      cell: BoldCell,
      enableSorting: false
    }
  ),
  columnHelper.accessor(
    (row) => (row.campaignStats?.OverallCommission ? row.campaignStats?.OverallCommission : '0'),
    {
      id: 'OverallCommission',
      header: 'Overall Commission',
      cell: BoldCell,
      enableSorting: false
    }
  )
];
