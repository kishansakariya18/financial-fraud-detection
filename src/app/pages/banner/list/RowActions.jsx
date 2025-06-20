// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';

import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';

import { TbEdit, TbStatusChange } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import BannerService from 'services/banner.services';
import { useNavigate } from 'react-router';
// import { EditCategory } from '../EditCategory';

export function RowActions({ row, table }) {
  const { t } = useTranslation();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [confirmStatusLoading, setConfirmStatusLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const confirmMessages = {
    pending: {
      title: t('change') + ' ' + t('status'),
      description: t('banner_status_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('banner') + ' ' + t('status') + ' ' + t('changed'),
      description: t('banner_status_suceess')
    }
  };

  const deleteConfirmMessages = {
    pending: {
      title: t('delete_key') + ' ' + t('banner'),
      description: t('banner_delete_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('banner') + ' ' + t('delete_success'),
      description: t('banner_delete_suceess')
    },
    error: {
      Icon: XCircleIcon,
      title: "Can't Delete Banner...",
      description: errorMessage,
      iconClassName: 'text-error'
    }
  };

  const closeModal = () => {
    setStatusModalOpen(false);
  };

  const openModal = () => {
    setStatusModalOpen(true);
    setStatusError(false);
    setStatusSuccess(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setErrorMessage(false);
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await BannerService.deleteBanner(row.original.id);
    if (result.status === 200) {
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
    } else {
      setErrorMessage(result.error);
      setDeleteError(true);
    }

    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const deleteState = deleteError ? 'error' : deleteSuccess ? 'success' : 'pending';

  const handleChangeStatusRows = useCallback(async () => {
    setConfirmStatusLoading(true);
    const result = await BannerService.changeBannerStatus(row.original.id);
    if (result.status === 200) {
      console.log('table.options: ', table.options);

      table.options.meta?.deleteRow(row);
      setStatusSuccess(true);
    } else {
      setStatusError(true);
    }

    setConfirmStatusLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const state = statusError ? 'error' : statusSuccess ? 'success' : 'pending';

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
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => navigate(`/content-management/banner/${row.original.id}/edit`)}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                      focus && 'bg-this/10 dark:bg-this-light/10'
                    )}>
                    <TbEdit className="size-4.5 stroke-1" />
                    <span>{t('edit') + ' ' + t('banner')}</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={openDeleteModal}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                      focus && 'bg-this/10 dark:bg-this-light/10'
                    )}>
                    <TrashIcon className="size-4.5 stroke-1" />
                    <span>{`${t('Delete')}  ${t('banner')}`}</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
      <ConfirmModal
        show={statusModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleChangeStatusRows}
        confirmLoading={confirmStatusLoading}
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
