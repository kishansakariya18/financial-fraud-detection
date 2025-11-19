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

export default function PlayerSegmentationList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('player_segmentation') + ' ' + t('list');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { hasPermission } = usePermissions();
  const canShowActions =
    hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.LIST) ||
    hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.EDIT) ||
    hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.CHANGE_STATUS) ||
    hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.PLAYER_LIST);

  // TODO: Add API call here
  const fetchPlayerSegmentations = async () => {
    // const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    // const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    // Placeholder - API call will be added later
    return {
      status: 200,
      data: [],
      totalRecords: 0
    };
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
      filtersFromQuery.push({ id: 'name', value: queryParams.keyword });
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
      if (data.id === 'name') {
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
        searchColumn="name"
        searchPlaceholder={t('search') + ' ' + t('name') + '...'}
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
              { value: 1, label: t('active'), color: 'success' },
              { value: 0, label: t('inactive'), color: 'error' }
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
              maxDate: new Date().fp_incr?.(1)
            }
          }
        ]}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
