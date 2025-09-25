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
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { BoldCell, IdCell } from 'components/custom/table/cell';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor((row) => row.UserID, {
    id: 'UserID',
    header: 'User ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.Username, {
    id: 'Username',
    header: 'Username',
    cell: CopyableCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.CampaignID, {
    id: 'CampaignID',
    header: 'Campaign ID',
    cell: BoldCell,
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
  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliates' },
    { title: t('user') + ' ' + t('list') }
  ];

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('affiliates') + ' ' + t('user') + ' ' + t('list')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
      </div>
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
