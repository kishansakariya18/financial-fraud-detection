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
import CampaignService from 'services/campaign.service';
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

  const fetchCampaigns = async (params) => {
    const pageIndex = isNaN(params?.pageIndex) ? DEFAULT_PAGE_INDEX : +params.pageIndex;
    const pageSize = isNaN(params?.pageSize) ? DEFAULT_PER_PAGE_RECORD : +params.pageSize;

    const filters = {
      keyword: params?.keyword,
      status: params?.status,
      startDate: params?.startDate,
      endDate: params?.endDate
    };

    const response = await CampaignService.campaignList({
      filters,
      pagination: { pageIndex, pageSize }
    });

    // Response can be either { status, data, totalRecords } or { status, response: { data, total_record } }
    if (response?.status === 200) {
      const apiData = campaignListResponseMapper(
        response?.response
          ? response.response
          : { data: response.data || [], totalRecords: response.totalRecords }
      );

      return {
        status: 200,
        data: apiData.list,
        totalRecords: apiData.totalRecords || apiData.list.length || 0,
        totalPages: Math.ceil((apiData.totalRecords || apiData.list.length || 0) / pageSize)
      };
    }

    return { status: response?.status || 500, error: 'Error loading campaigns' };
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
