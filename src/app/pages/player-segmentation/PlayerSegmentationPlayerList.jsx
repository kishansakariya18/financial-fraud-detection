import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLockScrollbar } from 'hooks';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { TableToolbar } from 'components/shared/table/TableToolbar';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import PlayerSegmentationService from 'services/player-segmentation.services';
import { createColumnHelper } from '@tanstack/react-table';
import { BadgeCell, DateCell } from 'components/custom/table/cell';

const columnHelper = createColumnHelper();

// Player list columns
const playerColumns = [
  columnHelper.accessor('userUID', {
    id: 'userUID',
    header: 'User UID',
    enableSorting: false,
    size: 140
  }),
  columnHelper.accessor('username', {
    id: 'username',
    header: 'Username',
    enableSorting: false,
    size: 160
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: 'Email',
    enableSorting: false,
    size: 200
  }),
  columnHelper.accessor('mobile', {
    id: 'mobile',
    header: 'Mobile',
    enableSorting: false,
    size: 140
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    cell: BadgeCell,
    meta: {
      optionData: [
        { value: 'active', label: 'Active', color: 'success' },
        { value: 'inactive', label: 'Inactive', color: 'error' },
        { value: 'blocked', label: 'Blocked', color: 'warning' }
      ]
    },
    enableSorting: false,
    size: 100
  }),
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    header: 'Joined Date',
    cell: DateCell,
    enableSorting: false,
    size: 160
  })
];

export default function PlayerSegmentationPlayerList() {
  const { t } = useTranslation();
  const { segmentationUID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [segmentationName, setSegmentationName] = useState('');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const pageTitle =
    t('player') + ' ' + t('list') + (segmentationName ? ` - ${segmentationName}` : '');

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/bonus/player-segmentation' },
    { title: t('player') + ' ' + t('list') }
  ];

  // Fetch player list
  const fetchPlayers = async () => {
    try {
      if (!segmentationUID) {
        throw new Error('Segmentation UID is required');
      }

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

      // Call API service
      const response = await PlayerSegmentationService.getPlayerList(
        segmentationUID,
        pageIndex,
        pageSize,
        filters
      );

      // Map API response to frontend format
      // TODO: Update mapper when API response structure is finalized
      const mappedData = (response.response?.data || response.response?.players || []).map(
        (player) => ({
          userUID: player.UserUID || player.userUID,
          username: player.UserName || player.username,
          email: player.Email || player.email,
          mobile: player.Mobile || player.mobile,
          status: player.Status?.toLowerCase() || player.status?.toLowerCase() || 'active',
          createdAt: player.CreatedAt || player.createdAt
        })
      );

      return {
        status: response.status,
        data: mappedData,
        totalRecords: response.response?.totalRecords || response.response?.total || 0
      };
    } catch (error) {
      console.error('Error fetching player list:', error);
      throw error;
    }
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: playerColumns,
    fetchData: fetchPlayers,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['userUID'], right: [] },
      tableSettings: {},
      columnVisibility: {}
    }
  });

  // Fetch segmentation name for display
  useEffect(() => {
    const fetchSegmentationName = async () => {
      try {
        if (segmentationUID) {
          const response = await PlayerSegmentationService.detail(segmentationUID);
          if (response.status === 200 && response.response?.data) {
            setSegmentationName(
              response.response.data.SegmentName || response.response.data.segmentName || ''
            );
          }
        }
      } catch (error) {
        console.error('Error fetching segmentation name:', error);
      }
    };

    fetchSegmentationName();
  }, [segmentationUID]);

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
      filtersFromQuery.push({ id: 'username', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'username') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status })
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
    <Page title={pageTitle}>
      <div className="">
        <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x]">
          <div className="flex items-center space-x-4 py-2 lg:py-3 rtl:space-x-reverse">
            <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
              {pageTitle}
            </h2>
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        </div>
        <TableToolbar
          table={table}
          // pageTitle={pageTitle}
          onApplyFilters={applyFilterHandler}
          onClearFilters={clearFilterHandler}
          searchColumn="username"
          searchPlaceholder={t('search') + ' ' + t('username') + ', ' + t('email') + '...'}
          // backButton={{
          //   show: true,
          //   route: '/bonus/player-segmentation',
          //   text: t('back') + ' ' + t('to') + ' ' + t('player_segmentation')
          // }}
          // filters={[
          //   {
          //     type: 'faceted',
          //     column: 'status',
          //     title: t('status'),
          //     options: [
          //       { value: 'active', label: t('active'), color: 'success' },
          //       { value: 'inactive', label: t('inactive'), color: 'error' },
          //       { value: 'blocked', label: t('blocked'), color: 'warning' }
          //     ],
          //     isMultiple: false,
          //     showCheckbox: false
          //   }
          // ]}
        />
        <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
      </div>
    </Page>
  );
}
