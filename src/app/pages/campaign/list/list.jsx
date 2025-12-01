import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { campaignListResponseMapper } from '../helper';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

export default function CampaignList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('campaign') + ' ' + t('list');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { hasPermission } = usePermissions();
  const canShowActions =
    hasPermission(PERMISSIONS.CAMPAIGN?.EDIT) ||
    hasPermission(PERMISSIONS.CAMPAIGN?.CHANGE_STATUS) ||
    hasPermission(PERMISSIONS.CAMPAIGN?.DELETE);

  const fetchCampaigns = async () => {
    // const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    // const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    // Dummy data for initial implementation
    const dummyData = {
      status: 200,
      response: {
        total_record: 3,
        data: [
          {
            CampaignID: 1,
            CampaignUID: 'camp-001',
            CampaignName: 'August Kickoff Reloads',
            Status: 0,
            StartDate: '2024-08-01T00:00:00Z',
            EndDate: '2024-08-31T23:59:59Z',
            Description: 'Internal notes for admins',
            Tags: ['promo', 'demo01', 'campaign'],
            DateCreated: '2024-07-15T10:00:00Z',
            DateModified: '2024-07-20T15:30:00Z',
            admin: { Username: 'admin' }
          },
          {
            CampaignID: 2,
            CampaignUID: 'camp-002',
            CampaignName: 'Welcome Bonus Campaign',
            Status: 1,
            StartDate: '2024-12-01T00:00:00Z',
            EndDate: '2024-12-31T23:59:59Z',
            Description: 'New user welcome campaign',
            Tags: ['welcome', 'bonus'],
            DateCreated: '2024-11-01T10:00:00Z',
            DateModified: '2024-11-15T12:00:00Z',
            admin: { Username: 'admin' }
          },
          {
            CampaignID: 3,
            CampaignUID: 'camp-003',
            CampaignName: 'Holiday Special',
            Status: 0,
            StartDate: '2024-12-20T00:00:00Z',
            EndDate: '2025-01-05T23:59:59Z',
            Description: 'Holiday season special offers',
            Tags: ['holiday', 'special', 'seasonal'],
            DateCreated: '2024-11-20T09:00:00Z',
            DateModified: '2024-11-25T14:00:00Z',
            admin: { Username: 'admin' }
          }
        ]
      }
    };

    const apiData = campaignListResponseMapper(dummyData.response);

    if (dummyData.status === 200) {
      return {
        status: 200,
        data: apiData.list,
        totalRecords:
          parseInt(dummyData.response?.total_record, 10) || dummyData.response?.data?.length || 0,
        totalPages: 1
      };
    }
    return { status: dummyData.status, error: 'Error loading campaigns' };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns({ canShowActions }),
    fetchData: fetchCampaigns,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['ID'], right: canShowActions ? ['actions'] : [] },
      tableSettings: { enableFullScreen: false },
      columnVisibility: {}
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'Name', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'Status', value: queryParams.status });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'Start Date',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'Name') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'Status') {
        filterItems.status = data.value;
      }
      if (data.id === 'Start Date') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        table={table}
        pageTitle={pageTitle}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
