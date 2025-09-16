// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { Button } from 'components/ui';
import KYCProviderService from '../../../../services/kyc-provider.services';
import { TbStatusChange } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS } from 'constants/app.constant';
import usePermissions from 'app/router/usePermissions';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { useNavigate } from 'react-router';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [statusActionSuccess, setStatusActionSuccess] = useState(false);
  const [statusActionError, setStatusActionError] = useState(false);

  const [deleteActionError, setDeleteActionError] = useState(false);
  const [deleteActionSuccess, setDeleteActionSuccess] = useState(false);

  console.log(
    changeStatusModalOpen,
    deleteModalOpen,
    confirmLoading,
    statusActionSuccess,
    statusActionError,
    deleteActionError,
    deleteActionSuccess
  );

  const confirmMessages = {
    pending: {
      title: t('change') + ' ' + t('status'),
      description: t('provider_status'),
      actionText: t('submit')
    },
    success: {
      title: t('provider') + ' ' + t('status'),
      description: t('provider_status_success')
    },
    error: {
      title: t('provider') + ' ' + t('status'),
      description: t('something_went_wrong')
    }
  };

  const deleteMessages = {
    pending: {
      title: t('deleteItem') + ' ' + t('provider'),
      description: t('provider_delete'),
      actionText: t('deleteItem')
    },
    success: {
      title: t('provider'),
      description: t('provider_delete_success')
    },
    error: {
      title: t('provider'),
      description: t('something_went_wrong')
    }
  };

  const closeModal = (action) => {
    console.log('action in close', action);

    if (action === 'status') {
      setChangeStatusModalOpen(false);
    } else {
      setDeleteModalOpen(false);
    }
    // setDeleteActionSuccess(false);
    // setStatusActionSuccess(false);
  };

  const openChangeStatusModal = () => {
    setChangeStatusModalOpen(true);
    setStatusActionError(false);
    setStatusActionSuccess(false);
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
    setDeleteActionError(false);
    setDeleteActionSuccess(false);
  };

  const handleChangeStatus = useCallback(async () => {
    setConfirmLoading(true);
    const result = await KYCProviderService.changeProviderStatus(row.original.uid);
    if (result.status === 200) {
      setStatusActionSuccess(true);
      table.options.meta?.changeStatus(row);
    } else {
      setStatusActionError(true);
    }
    setConfirmLoading(false);
  }, [row]);

  const handleDelete = useCallback(async () => {
    setConfirmLoading(true);
    const result = await KYCProviderService.deleteProvider(row.original.uid);
    if (result.status === 200) {
      console.log('200 response');

      setDeleteActionSuccess(true);
      table.options.meta?.deleteRow(row);
    } else {
      setDeleteActionError(true);
    }
    setConfirmLoading(false);
  }, [row]);

  const handleEdit = useCallback(() => {
    navigate(`/site-configuration/kyc-provider/edit/${row.original.uid}`);
  }, [navigate, row]);
  const state = statusActionError ? 'error' : statusActionSuccess ? 'success' : 'pending';
  const deleteState = deleteActionError ? 'error' : deleteActionSuccess ? 'success' : 'pending';
  console.log(state);
  console.log(deleteState);

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
              {hasPermission(PERMISSIONS.KYC_PROVIDER.EDIT) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleEdit}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}>
                      <PencilIcon className="size-4.5 stroke-1" />
                      <span>{t('edit')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {hasPermission(PERMISSIONS.KYC_PROVIDER.CHANGE_STATUS) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openChangeStatusModal}
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
              {hasPermission(PERMISSIONS.KYC_PROVIDER.DELETE) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openDeleteModal}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-red-500 outline-none transition-colors dark:text-red-400 rtl:space-x-reverse',
                        focus && 'bg-red-500/10 dark:bg-red-400/10'
                      )}>
                      <TrashIcon className="size-4.5" />
                      <span>{t('deleteItem')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={changeStatusModalOpen}
        onClose={() => closeModal('status')}
        messages={confirmMessages}
        onOk={handleChangeStatus}
        confirmLoading={confirmLoading}
        state={state}
      />
      <ConfirmModal
        show={deleteModalOpen}
        onClose={() => closeModal('delete')}
        messages={deleteMessages}
        onOk={handleDelete}
        confirmLoading={confirmLoading}
        state={deleteState}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
