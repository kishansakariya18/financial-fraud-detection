import { useEffect, useMemo, useCallback, useState } from 'react';
import { useSearchParams, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { TableToolbar } from 'components/shared/table/TableToolbar';
import { createColumnHelper } from '@tanstack/react-table';
import { BadgeCell } from 'components/custom/table/cell';
import CampaignTemplateService from 'services/campaign.service';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { EyeIcon } from '@heroicons/react/24/outline';
import ChangeHistoryModal from './CampaignChangeHistoryModal';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const columnHelper = createColumnHelper();

const CampaignChangeHistory = () => {
  const { t } = useTranslation();
  const { campaignUID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const [selectedChange, setSelectedChange] = useState(null);

  const breadcrumbItem = [
    { title: t('campaign_templates'), path: '/bonus/campaign-templates' },
    {
      title: t('view'),
      path: `/bonus/campaign-templates/${campaignUID}/tab/details`
    },
    { title: t('change_history') }
  ];

  const handleViewClick = (rowData) => {
    setSelectedChange(rowData);
  };

  const columns = [
    columnHelper.accessor('CampaignName', {
      header: t('campaign_name'),
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
      header: t('operation_type'),
      cell: BadgeCell,
      meta: {
        optionData: [
          { value: 'created', label: 'Create', color: 'success' },
          { value: 'updated', label: 'Update', color: 'info' },
          { value: 'deleted', label: 'Delete', color: 'error' },
          { value: 'archived', label: 'Archive', color: 'warning' }
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
      accessorFn: (row) => (row.EffectiveFrom ? getDateInUTCToTimeZone(row.EffectiveFrom) : '—'),
      size: 160,
      enableSorting: false
    }),
    columnHelper.accessor('EffectiveTo', {
      header: t('effective_to'),
      accessorFn: (row) => (row.EffectiveTo ? getDateInUTCToTimeZone(row.EffectiveTo) : '—'),
      size: 160,
      enableSorting: false
    }),
    columnHelper.accessor('CreatedAt', {
      header: t('date_created'),
      accessorFn: (row) => (row.CreatedAt ? getDateInUTCToTimeZone(row.CreatedAt) : '—'),
      size: 160,
      enableSorting: false
    }),
    columnHelper.display({
      id: 'actions',
      header: t('actions'),
      cell: ({ row }) => (
        <Button
          isIcon
          className="size-8 rounded-full"
          onClick={() => handleViewClick(row.original)}>
          <EyeIcon className="size-4" />
        </Button>
      ),
      size: 50,
      enableSorting: false
    })
  ];

  const fetchData = useCallback(async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const filters = {};
    if (queryParams.keyword) filters.keyword = queryParams.keyword;
    if (queryParams.startDate) filters.startDate = queryParams.startDate;
    if (queryParams.endDate) filters.endDate = queryParams.endDate;

    const params = {
      page: pageIndex + 1,
      per_page: pageSize,
      ...filters
    };

    const response = await CampaignTemplateService.campaignLogs(campaignUID, params);

    if (response.status === 200 && response.data) {
      return {
        status: response.status,
        data: response.data || [],
        totalRecords: response.totalRecords || 0
      };
    }

    throw new Error('Failed to fetch change log');
  }, [
    queryParams.keyword,
    queryParams.pageIndex,
    queryParams.pageSize,
    queryParams.startDate,
    queryParams.endDate,
    campaignUID
  ]);

  const { table, isLoading, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: [], right: ['actions'] },
      tableSettings: {},
      columnVisibility: {}
    }
  });

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'CampaignName', value: queryParams.keyword });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'CreatedAt',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }
    setColumnFilters(filtersFromQuery);
  }, [queryParams, setColumnFilters]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'CampaignName') filterItems.keyword = data.value;
      if (data.id === 'CreatedAt') filterItems.date = data.value;
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.date && { startDate: filterItems.date[0], endDate: filterItems.date[1] })
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

        <div>
          <TableToolbar
            table={table}
            onApplyFilters={applyFilterHandler}
            onClearFilters={clearFilterHandler}
            searchColumn="CampaignName"
            searchPlaceholder={t('search_campaign_name')}
            showSearch={false}
            filters={[
              {
                type: 'date',
                column: 'CreatedAt',
                title: t('date_range'),
                config: { mode: 'range', maxDate: new Date().fp_incr?.(1) }
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

      <ChangeHistoryModal
        isOpen={!!selectedChange}
        onClose={() => setSelectedChange(null)}
        changeData={selectedChange}
      />
    </Page>
  );
};

export default CampaignChangeHistory;
