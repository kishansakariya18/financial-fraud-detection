import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';

import { useTranslation } from 'react-i18next';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { TbStatusChange } from 'react-icons/tb';

export function BonusTemplateRowActions({
  row,
  table,
  onView,
  onEdit,
  onDelete,
  onChangeStatus,
  onDuplicate
}) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [duplicateSuccess, setDuplicateSuccess] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  const currentStatus = row?.original?.status || 'inactive';
  const isActive = String(currentStatus).toLowerCase() === 'active';

  const changeStatusMessages = {
    pending: {
      title: t('change') + ' ' + t('status'),
      description: isActive
        ? t('bonus_template_deactivate_confirmation')
        : t('bonus_template_activate_confirmation'),
      actionText: t('submit')
    },
    success: {
      title: t('bonus_template_status_changed'),
      description: t('bonus_template_status_changed_successfully')
    }
  };

  const deleteMessages = {
    pending: {
      title: t('Delete') + ' ' + t('bonus_template'),
      description: t('delete_bonus_template_confirmation'),
      actionText: t('Delete')
    },
    success: {
      title: t('deleted_successfully'),
      description: t('bonus_template_deleted_successfully')
    }
  };

  const duplicateMessages = {
    pending: {
      title: t('duplicate') + ' ' + t('bonus_template'),
      description: t('duplicate_bonus_template_confirmation'),
      actionText: t('duplicate')
    },
    success: {
      title: t('duplicated_successfully'),
      description: t('bonus_template_duplicated_successfully')
    }
  };

  const openStatusModal = () => {
    setStatusModalOpen(true);
    setStatusError(false);
    setStatusSuccess(false);
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const openDuplicateModal = () => {
    setDuplicateModalOpen(true);
    setDuplicateError(false);
    setDuplicateSuccess(false);
  };

  const closeDuplicateModal = () => {
    setDuplicateModalOpen(false);
  };

  const handleChangeStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const result = await onChangeStatus(row.original);
      if (result?.status === 200) {
        setStatusSuccess(true);
        table.options.meta?.fetchNewList?.(false);
      } else {
        setStatusError(true);
      }
    } catch {
      setStatusError(true);
    } finally {
      setStatusLoading(false);
    }
  }, [onChangeStatus, row, table]);

  const handleDelete = useCallback(async () => {
    if (typeof onDelete !== 'function') return;
    setDeleteLoading(true);
    try {
      const result = await onDelete(row.original);
      if (result?.status === 200) {
        setDeleteSuccess(true);
        toast.success(result?.response?.message || t('deleted_successfully') || 'Deleted');
        table.options.meta?.fetchNewList?.(false);
      } else {
        setDeleteError(true);
        toast.error(result?.error || t('something_went_wrong'));
      }
    } catch (error) {
      setDeleteError(true);
      toast.error(error?.message || t('something_went_wrong'));
    } finally {
      setDeleteLoading(false);
    }
  }, [onDelete, row, table, t]);

  const handleDuplicate = useCallback(async () => {
    if (typeof onDuplicate !== 'function') return;
    setDuplicateLoading(true);
    await onDuplicate(row.original)
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
  }, [onDuplicate, row, table]);

  const statusState = statusError ? 'error' : statusSuccess ? 'success' : 'pending';
  const deleteState = deleteError ? 'error' : deleteSuccess ? 'success' : 'pending';
  const duplicateState = duplicateError ? 'error' : duplicateSuccess ? 'success' : 'pending';

  const canView = hasPermission(PERMISSIONS.BONUS_TEMPLATES.VIEW) && typeof onView === 'function';
  const canEdit = hasPermission(PERMISSIONS.BONUS_TEMPLATES.EDIT) && typeof onEdit === 'function';
  const canDelete =
    hasPermission(PERMISSIONS.BONUS_TEMPLATES.DELETE) && typeof onDelete === 'function';
  const canDuplicate =
    hasPermission(PERMISSIONS.BONUS_TEMPLATES.ADD) && typeof onDuplicate === 'function';

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
              className="absolute z-[100] w-[12rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              {canView && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={() => onView(row.original)}>
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
                      onClick={() => onEdit(row.original)}>
                      <PencilSquareIcon className="size-4.5 stroke-1" />
                      <span>{t('edit') || 'Edit'}</span>
                    </button>
                  )}
                </MenuItem>
              )}

              {canEdit && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openStatusModal}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                        focus && 'bg-this/10 dark:bg-this-light/10'
                      )}>
                      <TbStatusChange className="size-4.5 stroke-1" />
                      <span>
                        {isActive ? t('deactivate') || 'Deactivate' : t('activate') || 'Activate'}
                      </span>
                    </button>
                  )}
                </MenuItem>
              )}

              {canDuplicate && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openDuplicateModal}
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

              {canDelete && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openDeleteModal}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-error outline-none transition-colors dark:text-error-light rtl:space-x-reverse',
                        focus && 'bg-error/10 dark:bg-error-light/10'
                      )}>
                      <TrashIcon className="size-4.5 stroke-1" />
                      <span>{t('Delete')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={statusModalOpen}
        onClose={closeStatusModal}
        messages={changeStatusMessages}
        onOk={handleChangeStatus}
        confirmLoading={statusLoading}
        state={statusState}
      />

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeDeleteModal}
        messages={{
          ...deleteMessages,
          error: {
            title: t('error') || 'Error',
            description:
              t('failed_to_delete_bonus_template') ||
              'Failed to delete the bonus template. Please try again.',
            actionText: t('retry') || 'Retry'
          }
        }}
        onOk={handleDelete}
        confirmLoading={deleteLoading}
        state={deleteState}
      />

      <ConfirmModal
        show={duplicateModalOpen}
        onClose={closeDuplicateModal}
        messages={{
          ...duplicateMessages,
          error: {
            title: t('error'),
            description: t('failed_to_duplicate_bonus_template'),
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

BonusTemplateRowActions.propTypes = {
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onDuplicate: PropTypes.func
};
