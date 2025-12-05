// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  SquaresPlusIcon,
  ArchiveBoxArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { TbStatusChange } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import CampaignService from 'services/campaign.service';
import { toast } from 'sonner';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [changeStatusSuccess, setChangeStatusSuccess] = useState(false);
  const [changeStatusError, setChangeStatusError] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [archiveError, setArchiveError] = useState(false);
  const navigate = useNavigate();

  const confirmMessages = {
    pending: {
      description: t('Are you sure you want to change the status of this campaign?'),
      actionText: t('submit')
    },
    success: {
      title: t('success'),
      description: t('Campaign status changed successfully')
    }
  };

  const deleteConfirmMessages = {
    pending: {
      description: t('Are you sure you want to delete this campaign?'),
      actionText: t('delete_text')
    },
    success: {
      title: t('success'),
      description: t('Campaign deleted successfully')
    }
  };

  const archiveConfirmMessages = {
    pending: {
      description: t('Are you sure you want to archive this campaign?'),
      actionText: t('archive')
    },
    success: {
      title: t('success'),
      description: t('Campaign archived successfully')
    }
  };

  const closeModal = () => {
    setChangeStatusModalOpen(false);
  };

  const openModal = () => {
    setChangeStatusModalOpen(true);
    setChangeStatusError(false);
    setChangeStatusSuccess(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const openArchiveModal = () => {
    setArchiveModalOpen(true);
    setArchiveError(false);
    setArchiveSuccess(false);
  };

  const closeArchiveModal = () => {
    setArchiveModalOpen(false);
  };

  const handleChangeStatus = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await CampaignService.changeCampaignStatus(row.original.campaignUID);
    if (result?.status === 200) {
      table.options.meta?.changeStatus(row);
      setChangeStatusSuccess(true);
      toast.success(result.response?.message || 'Status changed successfully');
    } else {
      setChangeStatusError(true);
      toast.error(result?.error || 'Failed to change status');
    }

    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const handleDeleteRows = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await CampaignService.deleteCampaign(row.original.campaignUID);
    if (result?.status === 200) {
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      toast.success(result.response?.message || 'Campaign deleted successfully', {
        invert: true
      });
    } else {
      setDeleteError(true);
      toast.error(result?.error || 'Failed to delete campaign');
    }

    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const state = changeStatusError ? 'error' : changeStatusSuccess ? 'success' : 'pending';
  const deleteState = deleteError ? 'error' : deleteSuccess ? 'success' : 'pending';
  const archiveState = archiveError ? 'error' : archiveSuccess ? 'success' : 'pending';

  const handleArchive = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await CampaignService.archiveCampaign(row.original.campaignUID);
    if (result?.status === 200) {
      setArchiveSuccess(true);
      toast.success(result.response?.message || 'Campaign archived successfully');
      table.options.meta?.deleteRow(row);
    } else {
      setArchiveError(true);
      toast.error(result?.error || 'Failed to archive campaign');
    }
    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const handleClone = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await CampaignService.cloneCampaign(row.original.campaignUID);
    if (result?.status === 200) {
      toast.success(result.response?.message || 'Campaign cloned successfully');
      // refresh the list in place
      table.options.meta?.fetchNewList(false);
    } else {
      toast.error(result?.error || 'Failed to clone campaign');
    }
    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const isArchived = row?.original?.status === 'archive';

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
              className="absolute z-[100] w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              {!isArchived && hasPermission(PERMISSIONS.CAMPAIGN?.EDIT) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={() => navigate(`/campaign/${row.original.campaignUID}/edit`)}>
                      <PencilIcon className="size-4.5 stroke-1" />
                      <span>{t('edit')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {!isArchived && hasPermission(PERMISSIONS.CAMPAIGN?.EDIT) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openArchiveModal}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-warning outline-none transition-colors dark:text-warning-light rtl:space-x-reverse',
                        focus && 'bg-warning/10 dark:bg-warning-light/10'
                      )}>
                      <ArchiveBoxArrowDownIcon className="size-4.5 stroke-1" />
                      <span>{t('archive') || 'Archive'}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {hasPermission(PERMISSIONS.CAMPAIGN?.CREATE) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleClone}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}>
                      <SquaresPlusIcon className="size-4.5 stroke-1" />
                      <span>{t('clone') || 'Clone'}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {!isArchived && hasPermission(PERMISSIONS.CAMPAIGN?.CHANGE_STATUS) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openModal}
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
              {/* View visible always; specifically needed when archived */}
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => navigate(`/campaign/${row.original.campaignUID}`)}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}>
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>{t('view') || 'View'}</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={changeStatusModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleChangeStatus}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
      <ConfirmModal
        show={archiveModalOpen}
        onClose={closeArchiveModal}
        messages={archiveConfirmMessages}
        onOk={handleArchive}
        confirmLoading={confirmDeleteLoading}
        state={archiveState}
      />
      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeDeleteModal}
        messages={deleteConfirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={deleteState}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
