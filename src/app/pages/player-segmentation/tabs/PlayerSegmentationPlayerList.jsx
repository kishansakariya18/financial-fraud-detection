import { useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import PlayerList from 'components/sections/player-segmentation/PlayerList';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import PlayerSegmentationService from 'services/player-segmentation.services';
import { createColumnHelper } from '@tanstack/react-table';
import { BadgeCell, DateCell, IdCell } from 'components/custom/table/cell';
import { ExportCSV } from 'components/custom/export';
import apiConfig from 'configs/api.config';
import { getQueryParams } from 'utils/custom.utilities';
import { CopyableCell } from 'components/shared/table/CopyableCell';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const columnHelper = createColumnHelper();

// Player list columns
const playerColumns = [
  columnHelper.accessor('userID', {
    id: 'userID',
    header: 'User ID',
    label: 'User ID',
    cell: IdCell,
    enableSorting: false,
    size: 140
  }),
  columnHelper.accessor('username', {
    id: 'username',
    header: 'Username',
    label: 'Username',
    cell: CopyableCell,
    enableSorting: false,
    size: 160
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: 'Email',
    label: 'Email',
    cell: CopyableCell,
    enableSorting: false,
    size: 200
  }),
  columnHelper.accessor('mobile', {
    id: 'mobile',
    header: 'Mobile',
    label: 'Mobile',
    cell: CopyableCell,
    enableSorting: false,
    size: 140
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    label: 'Status',
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
  columnHelper.accessor((row) => getDateInUTCToTimeZone(row.createdAt), {
    id: 'createdAt',
    header: 'Joined Date',
    label: 'Joined Date',
    cell: DateCell,
    enableSorting: false,
    size: 160
  })
];

export default function PlayerSegmentationPlayerList() {
  const { segmentationUID } = useParams();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/bonus/player-segmentation' },
    // {
    //   title: t('view'),
    //   path: `/bonus/player-segmentation/${segmentationUID}/tab/details`
    // },
    { title: t('players') }
  ];

  // Get filters from URL params
  const filters = useMemo(() => {
    const params = getQueryParams(searchParams);
    const exportFilters = {};

    if (params.keyword) {
      exportFilters.keyword = params.keyword;
    }
    if (params.status) {
      exportFilters.status = params.status;
    }

    return exportFilters;
  }, [searchParams]);

  // Fetch player list
  const fetchPlayers = async (params) => {
    try {
      if (!segmentationUID) {
        throw new Error('Segmentation UID is required');
      }

      const pageIndex = isNaN(params.pageIndex) ? DEFAULT_PAGE_INDEX : +params.pageIndex;
      const pageSize = isNaN(params.pageSize) ? DEFAULT_PER_PAGE_RECORD : +params.pageSize;

      // Build filters from query params
      const filters = {};
      if (params.keyword) {
        filters.keyword = params.keyword;
      }
      if (params.status) {
        filters.status = params.status;
      }

      // Call API service
      const response = await PlayerSegmentationService.getPlayerList(
        segmentationUID,
        pageIndex,
        pageSize,
        filters
      );
      // Map API response to frontend format
      const mappedData = (response.response?.data || response.response?.players || []).map(
        (player) => ({
          userID: player.UserID,
          username: player.Username,
          email: player.Email,
          phoneCode: player.PhoneCode,
          mobile: player.Mobile,
          firstName: player.FirstName,
          lastName: player.LastName,
          status: player.Status?.toLowerCase() || player.status?.toLowerCase() || 'active',
          createdAt: player.SegmentationJoinedAt
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

  return (
    <Page title={t('player_segmentation')} breadcrumbItem={breadcrumbItem}>
      <div className="transition-content pb-8">
        <div className="grid w-full grid-rows-[auto_1fr] px-[--margin-x]">
          <div className="flex items-center justify-between space-x-4 pt-5 lg:pt-6 rtl:space-x-reverse">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
                {t('players')}
              </h2>
              <div className="hidden self-stretch py-1 sm:flex">
                <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
              </div>
              <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
            </div>

            {/* Export Button */}
            <ExportCSV
              apiEndpoint={apiConfig.endPoints.PLAYER_SEGMENTATION.PLAYER_LIST_EXPORT.replace(
                ':segmentationUID',
                segmentationUID
              )}
              requestFilters={filters}
            />
          </div>
        </div>
        <PlayerList fetchData={fetchPlayers} columns={playerColumns} />
      </div>
    </Page>
  );
}
