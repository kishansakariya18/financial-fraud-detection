import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { Button } from 'components/ui';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { TbStatusChange } from 'react-icons/tb';
import PlayerSegmentationService from 'services/player-segmentation.services';

export function PlayerSegmentationRowActions({ row, table }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const [refreshModalOpen, setRefreshModalOpen] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [refreshError, setRefreshError] = useState(false);

  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [duplicateSuccess, setDuplicateSuccess] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  const currentStatus = row?.original?.status || 'inactive';
  const isActive = String(currentStatus).toLowerCase() === 'active';

  const canView = hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.VIEW);
  const canEdit = hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.EDIT);
  const canChangeStatus = hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.CHANGE_STATUS);
  const canRefresh = hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.REFRESH);
  const canViewPlayers = hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.PLAYER_LIST);
  const canDuplicate = hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.ADD);

  // Messages
  const changeStatusMessages = {
    pending: {
      title: t('change') + ' ' + t('status'),
      description: isActive
        ? t('player_segmentation_deactivate_confirmation')
        : t('player_segmentation_activate_confirmation'),
      actionText: t('confirm')
    },
    success: {
      title: t('status') + ' ' + t('changed'),
      description: t('player_segmentation_status_changed_successfully')
    }
  };

  const refreshMessages = {
    pending: {
      title: t('refresh') + ' ' + t('player_segmentation'),
      description: t('player_segmentation_refresh_confirmation'),
      actionText: t('refresh')
    },
    success: {
      title: t('refresh_success'),
      description: t('player_segmentation_refreshed_successfully')
    }
  };

  const duplicateMessages = {
    pending: {
      title: t('duplicate') + ' ' + t('player_segmentation'),
      description: t('player_segmentation_duplicate_confirmation'),
      actionText: t('duplicate')
    },
    success: {
      title: t('duplicated_successfully'),
      description: t('player_segmentation_duplicated_successfully')
    }
  };

  // Handlers
  const handleView = () => {
    navigate(`/bonus/player-segmentation/${row.original.segmentationUID}/view`);
  };

  const handleEdit = () => {
    navigate(`/bonus/player-segmentation/${row.original.segmentationUID}/edit`);
  };

  const handlePlayerList = () => {
    navigate(`/bonus/player-segmentation/${row.original.segmentationUID}/players`);
  };

  const handleChangeStatus = useCallback(() => {
    setStatusLoading(true);
    PlayerSegmentationService.changeStatus(row.original.segmentationUID)
      .then(() => {
        setStatusSuccess(true);
        table.options.meta?.fetchNewList?.(false);
      })
      .catch((error) => {
        setStatusError(true);
        toast.error(error?.message);
      })
      .finally(() => {
        setStatusLoading(false);
      });
  }, [row, table]);

  const handleRefresh = useCallback(() => {
    setRefreshLoading(true);
    PlayerSegmentationService.refresh(row.original.segmentationUID)
      .then(({ response }) => {
        setRefreshSuccess(true);
        toast.success(response?.message);
        table.options.meta?.fetchNewList?.(false);
      })
      .catch((error) => {
        setRefreshError(true);
        toast.error(error);
      })
      .finally(() => {
        setRefreshLoading(false);
      });
  }, [row, table]);

  const handleDuplicate = useCallback(() => {
    setDuplicateLoading(true);
    PlayerSegmentationService.duplicate(row.original.segmentationUID)
      .then(({ response }) => {
        setDuplicateSuccess(true);
        toast.success(response?.message);
        table.options.meta?.fetchNewList?.(false);
      })
      .catch((error) => {
        setDuplicateError(true);
        toast.error(error);
      })
      .finally(() => {
        setDuplicateLoading(false);
      });
  }, [row, table]);

  const statusState = statusError ? 'error' : statusSuccess ? 'success' : 'pending';
  const refreshState = refreshError ? 'error' : refreshSuccess ? 'success' : 'pending';
  const duplicateState = duplicateError ? 'error' : duplicateSuccess ? 'success' : 'pending';

  return (
    <>
      <div className="flex justify-center space-x-1.5 rtl:space-x-reverse">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} isIcon className="size-8 rounded-full">
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2">
            <MenuItems
              anchor={{ to: 'bottom end', gap: 12 }}
              className="absolute z-[100] w-[14rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              {canView && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={handleView}>
                      <EyeIcon className="size-4.5 stroke-1" />
                      <span>{t('view')}</span>
                    </button>
                  )}
                </MenuItem>
              )}

              {canEdit && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={handleEdit}>
                      <PencilSquareIcon className="size-4.5 stroke-1" />
                      <span>{t('edit')}</span>
                    </button>
                  )}
                </MenuItem>
              )}

              {canViewPlayers && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={handlePlayerList}>
                      <UserGroupIcon className="size-4.5 stroke-1" />
                      <span>{t('player') + ' ' + t('list')}</span>
                    </button>
                  )}
                </MenuItem>
              )}

              {canChangeStatus && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => setStatusModalOpen(true)}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                        focus && 'bg-this/10 dark:bg-this-light/10'
                      )}>
                      <TbStatusChange className="size-4.5 stroke-1" />
                      <span>{t('change') + ' ' + t('status')}</span>
                    </button>
                  )}
                </MenuItem>
              )}

              {canRefresh && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => setRefreshModalOpen(true)}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}>
                      <ArrowPathIcon className="size-4.5 stroke-1" />
                      <span>{t('refresh')}</span>
                    </button>
                  )}
                </MenuItem>
              )}

              {canDuplicate && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => setDuplicateModalOpen(true)}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}>
                      <DocumentDuplicateIcon className="size-4.5 stroke-1" />
                      <span>{t('duplicate')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {/* Change Status Modal */}
      <ConfirmModal
        show={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        messages={{
          ...changeStatusMessages,
          error: {
            title: t('error'),
            description: t('failed_to_change_status'),
            actionText: t('retry')
          }
        }}
        onOk={handleChangeStatus}
        confirmLoading={statusLoading}
        state={statusState}
      />

      {/* Refresh Modal */}
      <ConfirmModal
        show={refreshModalOpen}
        onClose={() => setRefreshModalOpen(false)}
        messages={{
          ...refreshMessages,
          error: {
            title: t('error'),
            description: t('failed_to_refresh'),
            actionText: t('retry')
          }
        }}
        onOk={handleRefresh}
        confirmLoading={refreshLoading}
        state={refreshState}
      />

      {/* Duplicate Modal */}
      <ConfirmModal
        show={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        messages={{
          ...duplicateMessages,
          error: {
            title: t('error'),
            description: t('failed_to_duplicate'),
            actionText: t('retry')
          }
        }}
        onOk={handleDuplicate}
        confirmLoading={duplicateLoading}
        state={duplicateState}
      />
    </>
  );
}

PlayerSegmentationRowActions.propTypes = {
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired
};
