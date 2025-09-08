// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { TrashIcon } from '@heroicons/react/24/outline';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';

import { useTranslation } from 'react-i18next';
import BlacklistService from 'services/blacklist.services';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const { hasPermission } = usePermissions();
  const [errorMessage, setErrorMessage] = useState('');
  const confirmMessages = {
    pending: {
      title: t('deleteDomain'),
      description: t('delete_email_domain_desc'),
      actionText: t('delete')
    },
    success: {
      title: t('deleteDomain'),
      description: t('email_domain_deleted_suceess')
    },
    error: {
      Icon: XCircleIcon,
      title: t('error'),
      description: errorMessage || t('failed_to_change_status'),
      iconClassName: 'text-error',
      actionText: t('retry')
    }
  };

  const closeModal = () => {
    setDeleteModalOpen(false);
  };

  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };
  const deleteState = deleteError ? 'error' : deleteSuccess ? 'success' : 'pending';

  const handleDelete = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await BlacklistService.deleteDisposableEmailDomain(row.original.id);
    if (result.status === 200) {
      // toast.success(result.response.messages);
      setTimeout(() => {
        navigate('/blacklist/tab/disposable-email');
      }, 0);
      setDeleteSuccess(true);
      table.options.meta?.deleteRow(row);
    } else {
      toast.error(result.error);
      setErrorMessage(result.error);
      setDeleteError(true);
    }
    setConfirmDeleteLoading(false);
  }, [row, t, table]);

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
              {hasPermission(PERMISSIONS.ADMIN.LIST) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openModal}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-red-500 outline-none transition-colors dark:text-red-500 rtl:space-x-reverse',
                        focus && 'bg-red-500/10 dark:bg-red-500/10'
                      )}>
                      <TrashIcon className="size-4.5 stroke-1" />
                      <span>{t('deleteDomain')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>
      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDelete}
        state={deleteState}
        confirmLoading={confirmDeleteLoading}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
