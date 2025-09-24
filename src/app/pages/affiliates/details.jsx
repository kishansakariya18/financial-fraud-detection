import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import ContentWrapper from 'components/ui/custom/ContentWrapper';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { createColumnHelper } from '@tanstack/react-table';
import AffiliatesService from 'services/affiliates.services';

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor((row) => row.CampaignName, {
    id: 'CampaignName',
    header: 'Campaign Name',
    cell: (info) => info.getValue() || '-',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.DateCreated, {
    id: 'DateCreated',
    header: 'Created At',
    cell: (info) => info.getValue() || '-',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CampaignLink, {
    id: 'CampaignLink',
    header: 'Campaign Link',
    cell: (info) => info.getValue() || '-',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.campaignStats?.Hits ?? 0, {
    id: 'Hits',
    header: 'Hits',
    cell: (info) => info.getValue(),
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.campaignStats?.ReferredUsers ?? 0, {
    id: 'ReferredUsers',
    header: 'Referred Users',
    cell: (info) => info.getValue(),
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.campaignStats?.FirstTimeDeposits ?? 0, {
    id: 'FirstTimeDeposits',
    header: 'First Time Deposits',
    cell: (info) => info.getValue(),
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.campaignStats?.TotalDeposits ?? 0, {
    id: 'TotalDeposits',
    header: 'Total Deposits',
    cell: (info) => info.getValue(),
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.campaignStats?.OverallCommission ?? 0, {
    id: 'OverallCommission',
    header: 'Overall Commission',
    cell: (info) => info.getValue(),
    enableSorting: false
  })
];

export default function AffiliateDetails() {
  const { t } = useTranslation();
  const { affiliateId } = useParams();
  const [summary, setSummary] = useState(null);

  const fetchData = async () => {
    const res = await AffiliatesService.getAffiliateDetail({ affiliateId });
    if (res.status === 200) {
      const payload = res.response?.data || {};
      const campaigns = Array.isArray(payload?.Camapgns) ? payload.Camapgns : [];
      setSummary(payload?.Summary || null);
      return { status: 200, data: campaigns, totalRecords: campaigns.length };
    }
    return { status: res.status, error: res.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData,
    queryParams: useMemo(() => ({}), []),
    setSearchParams: () => {},
    initialSettings: {
      columnPinning: { left: ['CampaignName'] },
      tableSettings: { enableFullScreen: false }
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const pageTitle = `${t('affiliates')} ${t('details')}`;

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      {summary && (
        <div className="grid grid-cols-1 gap-4 px-[--margin-x] py-4 sm:grid-cols-3">
          <div className="rounded-md border p-3">
            <div className="text-sm text-gray-500">Affiliate UID</div>
            <div className="text-base font-medium">{summary.AffiliateUID}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-sm text-gray-500">User ID</div>
            <div className="text-base font-medium">{summary.UserID}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-sm text-gray-500">Hits</div>
            <div className="text-base font-medium">{summary.Hits}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-sm text-gray-500">Referred Users</div>
            <div className="text-base font-medium">{summary.ReferredUsers}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-sm text-gray-500">First Time Deposits</div>
            <div className="text-base font-medium">{summary.FirstTimeDeposits}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-sm text-gray-500">Total Deposits</div>
            <div className="text-base font-medium">{summary.TotalDeposits}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-sm text-gray-500">Overall Commission</div>
            <div className="text-base font-medium">{summary.OverallCommission}</div>
          </div>
        </div>
      )}
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
