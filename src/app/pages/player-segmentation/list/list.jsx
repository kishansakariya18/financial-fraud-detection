import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { playerSegmentationColumns } from './columns';
import { TableToolbar } from 'components/shared/table/TableToolbar';
import PlayerSegmentationService from 'services/player-segmentation.services';
import { playerSegmentationResponseMapper } from '../hapler';

export default function PlayerSegmentationList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('player_segmentation') + ' ' + t('list');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { hasPermission } = usePermissions();
  const canShowActions =
    hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.VIEW) ||
    hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.EDIT) ||
    hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.CHANGE_STATUS) ||
    hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.PLAYER_LIST);

  const fetchPlayerSegmentations = async () => {
    try {
      const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
      const pageSize = isNaN(queryParams.pageSize)
        ? DEFAULT_PER_PAGE_RECORD
        : +queryParams.pageSize;

      // Build filters from query params
      const filters = {};
      if (queryParams.keyword) {
        filters.keyword = queryParams.keyword;
      }
      if (queryParams.status) {
        filters.status = queryParams.status;
      }
      if (queryParams.startDate) {
        filters.startDate = queryParams.startDate;
      }
      if (queryParams.endDate) {
        filters.endDate = queryParams.endDate;
      }

      // Call API service
      const response = await PlayerSegmentationService.list(pageIndex, pageSize, filters);

      // Map API response to frontend format
      const mappedData = playerSegmentationResponseMapper(response.response.data || []);

      return {
        status: response.status,
        data: mappedData,
        totalRecords: response.response.totalRecords || 0
      };
    } catch (error) {
      console.error('Error fetching player segmentations:', error);
      throw error;
    }
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: playerSegmentationColumns({ canShowActions }),
    fetchData: fetchPlayerSegmentations,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: canShowActions ? ['actions'] : [] },
      tableSettings: {},
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
      filtersFromQuery.push({ id: 'segmentName', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'createdAt',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'segmentName') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
      if (data.id === 'createdAt') {
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
    <ContentWrapper
      pageTitle={t('player_segmentation')}
      title={pageTitle}
      enableFullScreen={tableSettings.enableFullScreen}>
      <TableToolbar
        table={table}
        pageTitle={pageTitle}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        searchColumn="segmentName"
        searchPlaceholder={t('search') + ' ' + t('segment_name') + '...'}
        createButton={{
          show: true,
          permission: PERMISSIONS.PLAYER_SEGMENTATION?.ADD || PERMISSIONS.SEGMENTATION.ADD,
          route: '/bonus/player-segmentation/create',
          text: t('create') + ' ' + t('player_segmentation')
        }}
        filters={[
          {
            type: 'faceted',
            column: 'status',
            title: t('status'),
            options: [
              { value: 'active', label: t('active'), color: 'success' },
              { value: 'inactive', label: t('inactive'), color: 'error' },
              { value: 'archived', label: t('archived'), color: 'warning' }
            ],
            isMultiple: false,
            showCheckbox: false
          },
          {
            type: 'date',
            column: 'createdAt',
            title: t('created_at'),
            config: {
              mode: 'range',
              maxDate: new Date().fp_incr?.(0)
            }
          }
        ]}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
