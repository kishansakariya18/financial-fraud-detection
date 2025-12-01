import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomModal } from 'components/custom/CustomModal';
import PlayerList from './PlayerList';
import { createColumnHelper } from '@tanstack/react-table';
import { toast } from 'sonner';
import PlayerSegmentationService from 'services/player-segmentation.services';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { CopyableCell } from 'components/shared/table/CopyableCell';

const columnHelper = createColumnHelper();

const PlayerListModal = ({ isOpen, onClose, segmentRules }) => {
  const { t } = useTranslation();
  const cachedDataRef = useRef(null);
  const lastRulesRef = useRef(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor('UserID', {
        id: 'userID',
        header: 'User ID',
        label: 'User ID',
        enableSorting: false,
        size: 100
      }),
      columnHelper.accessor('Username', {
        id: 'username',
        header: 'Username',
        label: 'Username',
        cell: CopyableCell,
        enableSorting: false,
        size: 160
      }),
      columnHelper.accessor('Email', {
        id: 'email',
        header: 'Email',
        label: 'Email',
        cell: CopyableCell,
        enableSorting: false,
        size: 200
      }),
      columnHelper.accessor('Mobile', {
        id: 'mobile',
        header: 'Mobile',
        label: 'Mobile',
        cell: (info) => {
          const phoneCode = info.row.original.PhoneCode || '';
          const mobile = info.getValue() || '';
          return `${phoneCode} ${mobile}`.trim() || '-';
        },
        enableSorting: false,
        size: 140
      }),
      columnHelper.accessor('FirstName', {
        id: 'firstName',
        header: 'First Name',
        label: 'First Name',
        enableSorting: false,
        size: 120
      }),
      columnHelper.accessor('LastName', {
        id: 'lastName',
        header: 'Last Name',
        label: 'Last Name',
        enableSorting: false,
        size: 120
      })
    ],
    []
  );

  // Fetch function with client-side pagination and caching
  const fetchPlayers = async (params) => {
    // Check if we need to fetch new data (if cache is empty or rules changed)
    // We use JSON.stringify for simple deep comparison of rules
    if (
      !cachedDataRef.current ||
      JSON.stringify(lastRulesRef.current) !== JSON.stringify(segmentRules)
    ) {
      try {
        const response = await PlayerSegmentationService.playerPreview({
          segmentRules
        });

        if (response?.response?.data?.users) {
          cachedDataRef.current = response.response.data.users;
        } else {
          toast.info(t('no_players_matched'));
          cachedDataRef.current = [];
        }
        lastRulesRef.current = segmentRules;
      } catch (error) {
        toast.error(error?.message || t('failed_to_preview'));
        cachedDataRef.current = [];
      }
    }

    const allUsers = cachedDataRef.current || [];
    const pageIndex = params?.pageIndex !== undefined ? +params.pageIndex : DEFAULT_PAGE_INDEX;
    const pageSize = params?.pageSize !== undefined ? +params.pageSize : DEFAULT_PER_PAGE_RECORD;

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const pageData = allUsers.slice(start, end);

    return {
      status: 200,
      data: pageData,
      totalRecords: allUsers.length
    };
  };

  return (
    <CustomModal show={isOpen} onClose={onClose} title={t('player_preview')} sizeClass="max-w-7xl">
      <div className="min-h-[200px]">
        <PlayerList
          fetchData={fetchPlayers}
          columns={columns}
          hideToolbar
          paginationEnabled={true}
          syncWithUrl={false}
          initialSettings={{
            columnPinning: { left: ['userID'], right: [] },
            tableSettings: { enableFullScreen: false }
          }}
        />
      </div>
    </CustomModal>
  );
};

export default PlayerListModal;
