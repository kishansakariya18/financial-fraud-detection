import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import AffiliatesService from 'services/affiliates.services';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor((row) => row.UserID, {
    id: 'UserID',
    header: 'User ID',
    cell: (info) => info.getValue(),
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.Username, {
    id: 'Username',
    header: 'Username',
    cell: (info) => info.getValue() || '-',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CampaignID, {
    id: 'CampaignID',
    header: 'Campaign ID',
    cell: (info) => info.getValue(),
    enableSorting: false
  })
];

export default function AffiliateUsersList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { affiliateId } = useParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const pageTitle = `${t('affiliates')} ${t('users')}`;

  const fetchData = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const result = await AffiliatesService.getReferrals({
      affiliateId,
      pagination: { pageIndex, pageSize }
    });

    if (result.status === 200) {
      const payload = result.response;
      const list = Array.isArray(payload?.data) ? payload.data : [];
      const totalRecords = parseInt(payload?.totalRecords, 10) || list.length || 0;
      return { status: 200, data: list, totalRecords };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['UserID'] },
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

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
