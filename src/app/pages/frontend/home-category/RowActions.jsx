// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, PencilIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { TbStatusChange } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import HomePageService from 'services/home-page.services';
import EditHomeCategory from './EditHomeCategory';
import { CustomModal } from 'components/custom';
import { useNavigate } from 'react-router';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const [chnageStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [changeStatusSuccess, setChangeStatusSuccess] = useState(false);
  const [changeStatusError, setChangeStatusError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { hasPermission } = usePermissions();

  const navigate = useNavigate();

  const confirmMessages = {
    pending: {
      description: t('homeCategory_status_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('homeCategory') + ' ' + t('status') + ' ' + t('changed'),
      description: t('homeCategory_status_suceess')
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

  const onOpenDialogBox = () => {
    setIsDialogOpen(true);
  };
  const onCloseDialogBox = () => {
    setIsDialogOpen(false);
  };

  const onOkDialogBox = async () => {
    await table.options.meta?.editRow(row);
    setIsDialogOpen(false);
  };

  const handleChangeStatus = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await HomePageService.changeHomeCategoryStatus(row.original.id);
    if (result.status === 200) {
      table.options.meta?.changeStatus(row);
      setChangeStatusSuccess(true);
    } else {
      setChangeStatusError(true);
    }

    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const state = changeStatusError ? 'error' : changeStatusSuccess ? 'success' : 'pending';

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
              {hasPermission(PERMISSIONS.FRONTEND.CHANGE_HOME_CATEGORY_STATUS) && (
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

              {hasPermission(PERMISSIONS.FRONTEND.EDIT_HOME_CATEGORY) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-2 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={() => setIsDialogOpen(true)}>
                      <PencilIcon className="size-4.5 stroke-1" />
                      <span>{t('change') + ' ' + t('category')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {hasPermission(PERMISSIONS.FRONTEND.VIEW_HOME_GAMES) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-2 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={() => navigate(`/home-games/${row?.original?.id}/list`)}>
                      <PuzzlePieceIcon className="size-4.5 stroke-1" />
                      <span>{t('view') + ' ' + t('games')}</span>
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

      <CustomModal
        show={isDialogOpen}
        title={t('edit') + ' ' + t('category')}
        btnTitle={t('edit') + ' ' + t('category')}
        icon={<PencilIcon className="size-4.5 stroke-1" />}
        btnClassName={clsx(
          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
          focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
        )}
        onClose={onCloseDialogBox}
        onOpen={onOpenDialogBox}
        onOk={onOkDialogBox}>
        <EditHomeCategory onClose={onOkDialogBox} homeCategoryId={row?.original?.id} />
      </CustomModal>
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
