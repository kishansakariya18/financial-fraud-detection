import { useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { TableToolbar } from 'components/shared/table/TableToolbar';
import { createColumnHelper } from '@tanstack/react-table';
import { BadgeCell, DateCell } from 'components/custom/table/cell';
import PlayerSegmentationService from 'services/player-segmentation.services';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';

const columnHelper = createColumnHelper();

const PlayerActivity = () => {
  const { t } = useTranslation();
  const { segmentationUID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/bonus/player-segmentation' },
    // {
    //   title: t('view'),
    //   path: `/bonus/player-segmentation/${segmentationUID}/tab/details`
    // },
    { title: t('player_activity') }
  ];

  const columns = [
    columnHelper.accessor('User', {
      header: t('player'),
      cell: (info) => {
        const user = info.getValue();
        if (!user) return '—';
        return (
          <div className="flex flex-col">
            <span className="font-medium">{user.Username || '—'}</span>
            <span className="text-xs text-gray-500">{user.Email || '—'}</span>
          </div>
        );
      },
      size: 200,
      enableSorting: false
    }),
    columnHelper.accessor('UserID', {
      header: t('user_id'),
      cell: (info) => info.getValue() || '—',
      size: 100,
      enableSorting: false
    }),
    columnHelper.accessor('ChangeType', {
      header: t('action'),
      cell: BadgeCell,
      meta: {
        optionData: [
          { value: 'ADDED', label: 'Entered', color: 'success' },
          { value: 'REMOVED', label: 'Removed', color: 'error' }
        ]
      },
      size: 120,
      enableSorting: false
    }),
    columnHelper.accessor('EvaluationMode', {
      header: t('evaluation_type'),
      cell: BadgeCell,
      meta: {
        optionData: [
          { value: 'EVENT_DRIVEN', label: 'Event Driven', color: 'info' },
          { value: 'MANUAL', label: 'Manual', color: 'warning' },
          { value: 'SCHEDULED', label: 'Scheduled', color: 'success' }
        ]
      },
      size: 140,
      enableSorting: false
    }),
    columnHelper.accessor(
      (row) => (row.TriggerEvent ? capitalizeFirstLetter(row.TriggerEvent) : '—'),
      {
        header: t('trigger_event'),
        size: 140,
        enableSorting: false
      }
    ),
    columnHelper.accessor('ChangeReason', {
      header: t('reason'),
      cell: (info) => info.getValue() || '—',
      size: 180,
      enableSorting: false
    }),
    columnHelper.accessor((row) => getDateInUTCToTimeZone(row.EvaluationTime), {
      header: t('evaluation_time'),
      cell: DateCell,
      size: 160,
      enableSorting: false
    })
    // ,
    // columnHelper.accessor((row) => getDateInUTCToTimeZone(row.DateCreated), {
    //   header: t('logged_at'),
    //   cell: DateCell,
    //   size: 160,
    //   enableSorting: false
    // })
  ];

  const fetchData = useCallback(async () => {
    if (!segmentationUID) {
      return { status: 200, data: [], totalRecords: 0 };
    }

    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const filters = {};
    if (queryParams.keyword) {
      filters.keyword = queryParams.keyword;
    }
    if (queryParams.startDate) {
      filters.startDate = queryParams.startDate;
    }
    if (queryParams.endDate) {
      filters.endDate = queryParams.endDate;
    }

    const response = await PlayerSegmentationService.getMapChangeLog(
      segmentationUID,
      pageIndex,
      pageSize,
      filters
    );

    if (response.status === 200 && response.response) {
      return {
        status: response.status,
        data: response.response.data || [],
        totalRecords: response.response.totalRecords || 0
      };
    }

    throw new Error('Failed to fetch player activity log');
  }, [segmentationUID, queryParams]);

  const { table, isLoading, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: [], right: [] },
      tableSettings: {},
      columnVisibility: {}
    }
  });

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'User', value: queryParams.keyword });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'DateCreated',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'User') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'DateCreated') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems.date[1] })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
  };

  return (
    <Page title={t('player_activity')}>
      <div className="transition-content pb-8">
        <div className="grid w-full grid-rows-[auto_1fr] px-[--margin-x]">
          <div className="flex items-center space-x-4 pt-5 lg:pt-6 rtl:space-x-reverse">
            <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
              {t('player_activity')}
            </h2>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        </div>

        <TableToolbar
          table={table}
          onApplyFilters={applyFilterHandler}
          onClearFilters={clearFilterHandler}
          searchColumn="User"
          searchPlaceholder={`${t('search')} ${t('player')}`}
          showSearch={true}
          filters={[
            {
              type: 'date',
              column: 'DateCreated',
              title: t('date_range'),
              config: {
                mode: 'range',
                maxDate: new Date().fp_incr?.(1)
              }
            }
          ]}
        />
        <TableCard
          tableSettings={tableSettings}
          table={table}
          loading={isLoading}
          paginationEnabled={true}
        />
      </div>
    </Page>
  );
};

export default PlayerActivity;
