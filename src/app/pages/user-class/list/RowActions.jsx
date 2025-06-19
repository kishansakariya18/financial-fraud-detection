// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, PencilIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { TbStatusChange, TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import UserClassService from 'services/user-class.services';
import { toast } from 'sonner';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [chnageStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [changeStatusSuccess, setChangeStatusSuccess] = useState(false);
  const [changeStatusError, setChangeStatusError] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const navigate = useNavigate();

  const confirmMessages = {
    pending: {
      description: t('user_class_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('userClass') + ' ' + t('status') + ' ' + t('changed'),
      description: t('user_class_status_suceess')
    }
  };

  const deleteConfirmMessages = {
    pending: {
      description: t('user_class_delete_desc'),
      actionText: t('delete')
    },
    success: {
      title: t('userClass') + ' ' + t('deleted'),
      description: t('user_class_delete_suceess')
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

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleChangeStatus = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await UserClassService.userClassChangeStatus(row.original.userClassUID);
    if (result.status === 200) {
      table.options.meta?.changeStatus(row);
      setChangeStatusSuccess(true);
    } else {
      setChangeStatusError(true);
    }

    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const handleDeleteRows = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await UserClassService.userClassDelete(row.original.userClassUID);
    if (result.status === 200) {
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      toast.success('User Class deleted successfully', {
        invert: true
      });
      setTimeout(() => {
        navigate('/user-class');
      }, 0);
    } else {
      setDeleteError(true);
    }

    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const state = changeStatusError ? 'error' : changeStatusSuccess ? 'success' : 'pending';

  const deleteState = deleteError ? 'error' : deleteSuccess ? 'success' : 'pending';

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
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}
                    onClick={() => navigate(`/user-class/${row.original.userClassUID}/edit`)}>
                    <PencilIcon className="size-4.5 stroke-1" />
                    <span>{t('edit')}</span>
                  </button>
                )}
              </MenuItem>
              {hasPermission(PERMISSIONS.USER_CLASS.CHANGE_STATUS) && (
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
              {hasPermission(PERMISSIONS.USER_CLASS.DELETE) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openDeleteModal}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                        focus && 'bg-this/10 dark:bg-this-light/10'
                      )}>
                      <TbTrash className="size-4.5 stroke-1" />
                      <span>{t('delete')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {hasPermission(PERMISSIONS.USER_CLASS.LIMITS) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => navigate(`/user-class/${row.original.id}/limits`)}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                        focus && 'bg-this/10 dark:bg-this-light/10'
                      )}>
                      <TbTrash className="size-4.5 stroke-1" />
                      <span>{t('limits')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={chnageStatusModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleChangeStatus}
        confirmLoading={confirmDeleteLoading}
        state={state}
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
