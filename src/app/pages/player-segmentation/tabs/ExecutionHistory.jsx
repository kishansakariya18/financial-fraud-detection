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

const columnHelper = createColumnHelper();

const ExecutionHistory = () => {
  const { t } = useTranslation();
  const { segmentationUID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/bonus/player-segmentation' },
    {
      title: t('view'),
      path: `/bonus/player-segmentation/${segmentationUID}/tab/details`
    },
    { title: t('execution_history') }
  ];

  const columns = [
    columnHelper.accessor('EvaluationType', {
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
    columnHelper.accessor('PlayersReEvaluated', {
      header: t('players_evaluated'),
      cell: (info) => info.getValue()?.toLocaleString() || '0',
      size: 130,
      enableSorting: false
    }),
    columnHelper.accessor('PlayersEntered', {
      header: t('players_entered'),
      cell: (info) => (
        <span className="font-medium text-green-600 dark:text-green-400">
          +{info.getValue()?.toLocaleString() || '0'}
        </span>
      ),
      size: 120,
      enableSorting: false
    }),
    columnHelper.accessor('PlayersExited', {
      header: t('players_exited'),
      cell: (info) => (
        <span className="font-medium text-red-600 dark:text-red-400">
          -{info.getValue()?.toLocaleString() || '0'}
        </span>
      ),
      size: 120,
      enableSorting: false
    }),
    columnHelper.accessor('StartTime', {
      header: t('start_time'),
      cell: DateCell,
      size: 160,
      enableSorting: false
    }),
    columnHelper.accessor('EndTime', {
      header: t('end_time'),
      cell: DateCell,
      size: 160,
      enableSorting: false
    }),
    columnHelper.accessor('HasError', {
      header: t('status'),
      cell: BadgeCell,
      meta: {
        optionData: [
          { value: true, label: 'Error', color: 'error' },
          { value: false, label: 'Success', color: 'success' }
        ]
      },
      size: 100,
      enableSorting: false
    })
  ];

  const fetchData = useCallback(async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const filters = {
      segmentationUID: segmentationUID
    };
    if (queryParams.evaluationType) {
      filters.evaluationType = queryParams.evaluationType;
    }
    if (queryParams.startDate) {
      filters.startDate = queryParams.startDate;
    }
    if (queryParams.endDate) {
      filters.endDate = queryParams.endDate;
    }

    const response = await PlayerSegmentationService.getExecutionLog(pageIndex, pageSize, filters);

    if (response.status === 200 && response.response) {
      return {
        status: response.status,
        data: response.response.data || [],
        totalRecords: response.response.totalRecords || 0
      };
    }

    throw new Error('Failed to fetch execution log');
  }, [
    queryParams.endDate,
    queryParams.evaluationType,
    queryParams.pageIndex,
    queryParams.pageSize,
    queryParams.startDate,
    segmentationUID
  ]);

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
    if (queryParams.evaluationType) {
      filtersFromQuery.push({ id: 'EvaluationType', value: queryParams.evaluationType });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'StartTime',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'EvaluationType') {
        filterItems.evaluationType = data.value;
      }
      if (data.id === 'StartTime') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.evaluationType && { evaluationType: filterItems.evaluationType }),
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
    <Page title={t('execution_history')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr]">
        <div className="flex items-center space-x-4 px-[--margin-x] pt-5 lg:pt-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('execution_history')}
          </h2>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <div className="">
          <TableToolbar
            table={table}
            onApplyFilters={applyFilterHandler}
            onClearFilters={clearFilterHandler}
            showSearch={false}
            filters={[
              {
                type: 'faceted',
                column: 'EvaluationType',
                title: t('evaluation_type'),
                options: [
                  {
                    value: 'EVENT_DRIVEN',
                    label: t('evaluation_type_event_driven'),
                    color: 'info'
                  },
                  { value: 'MANUAL', label: t('evaluation_type_manual'), color: 'warning' },
                  {
                    value: 'SCHEDULED',
                    label: t('evaluation_type_scheduled'),
                    color: 'success'
                  }
                ],
                isMultiple: false,
                showCheckbox: false
              },
              {
                type: 'date',
                column: 'StartTime',
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
      </div>
    </Page>
  );
};

export default ExecutionHistory;
