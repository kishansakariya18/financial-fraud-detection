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

const ChangeHistory = () => {
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
    { title: t('change_history') }
  ];

  const columns = [
    columnHelper.accessor('SegmentName', {
      header: t('segment_name'),
      cell: (info) => info.getValue() || '—',
      size: 200,
      enableSorting: false
    }),
    columnHelper.accessor('Version', {
      header: t('version'),
      cell: (info) => `v${info.getValue()}`,
      size: 80,
      enableSorting: false
    }),
    columnHelper.accessor('ChangeType', {
      header: t('change_type'),
      cell: BadgeCell,
      meta: {
        optionData: [
          { value: 'CREATED', label: 'Created', color: 'success' },
          { value: 'UPDATED', label: 'Updated', color: 'info' },
          { value: 'DELETED', label: 'Deleted', color: 'error' },
          { value: 'ACTIVATED', label: 'Activated', color: 'success' },
          { value: 'DEACTIVATED', label: 'Deactivated', color: 'warning' }
        ]
      },
      size: 120,
      enableSorting: false
    }),
    columnHelper.accessor('ChangedBy', {
      header: t('changed_by'),
      cell: (info) => info.getValue() || '—',
      size: 150,
      enableSorting: false
    }),
    columnHelper.accessor('EffectiveFrom', {
      header: t('effective_from'),
      cell: DateCell,
      size: 160,
      enableSorting: false
    }),
    columnHelper.accessor('EffectiveTo', {
      header: t('effective_to'),
      cell: DateCell,
      size: 160,
      enableSorting: false
    }),
    columnHelper.accessor('DateCreated', {
      header: t('date_created'),
      cell: DateCell,
      size: 160,
      enableSorting: false
    })
  ];

  const fetchData = useCallback(async () => {
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

    const response = await PlayerSegmentationService.getChangeLog(pageIndex, pageSize, filters);

    if (response.status === 200 && response.response) {
      return {
        status: response.status,
        data: response.response.data || [],
        totalRecords: response.response.totalRecords || 0
      };
    }

    throw new Error('Failed to fetch change log');
  }, [queryParams]);

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
      filtersFromQuery.push({ id: 'SegmentName', value: queryParams.keyword });
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
      if (data.id === 'SegmentName') {
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
    <Page title={t('change_history')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr]">
        <div className="flex items-center space-x-4 px-[--margin-x] pt-5 lg:pt-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('change_history')}
          </h2>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <div className="">
          <TableToolbar
            table={table}
            onApplyFilters={applyFilterHandler}
            onClearFilters={clearFilterHandler}
            searchColumn="SegmentName"
            searchPlaceholder={t('search_segment_name')}
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
      </div>
    </Page>
  );
};

export default ChangeHistory;
