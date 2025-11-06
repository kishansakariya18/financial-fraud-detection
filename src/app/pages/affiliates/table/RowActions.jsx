// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  // UsersIcon,
  EyeIcon,
  PencilIcon
  // ListBulletIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { Button } from 'components/ui';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TbStatusChange } from 'react-icons/tb';
import AffiliatesService from 'services/affiliates.services';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { AFFILIATE_STATUS } from '../helper';
// import { HiOutlineCash } from 'react-icons/hi';

export function RowActions({ table, row }) {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const affiliateUID = row?.original?.affiliateUID;
  const { t } = useTranslation();

  const handleView = () => {
    navigate(`/affiliates/users/${affiliateUID}/tab`);
  };

  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [confirmChangeStatusLoading, setConfirmChangeStatusLoading] = useState(false);
  const [changeStatusSuccess, setChangeStatusSuccess] = useState(false);
  const [changeStatusError, setChangeStatusError] = useState(false);

  const confirmMessages = {
    pending: {
      title: t('change') + ' ' + t('status'),
      description: t('affiliate_status_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('affiliate') + ' ' + t('status') + ' ' + t('changed'),
      description: t('affiliate_status_suceess')
    }
  };
  const state = changeStatusError ? 'error' : changeStatusSuccess ? 'success' : 'pending';
  const closeModal = () => {
    setChangeStatusModalOpen(false);
  };

  const openModal = () => {
    setChangeStatusModalOpen(true);
    setChangeStatusError(false);
    setChangeStatusSuccess(false);
  };

  const handleChangeStatusRow = useCallback(async () => {
    setConfirmChangeStatusLoading(true);

    const newStatus =
      row.original.status === AFFILIATE_STATUS.ACTIVE
        ? AFFILIATE_STATUS.CLOSED
        : AFFILIATE_STATUS.ACTIVE;

    console.log('newStatus', newStatus);

    const result = await AffiliatesService.changeAffiliateStatus(affiliateUID, newStatus);
    if (result.status === 200) {
      table.options.meta?.changeStatus();
      setChangeStatusSuccess(true);
    } else {
      setChangeStatusError(true);
    }

    setConfirmChangeStatusLoading(false);
  }, [row]);

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
              {hasPermission(PERMISSIONS.AFFILIATES?.LIST) && (
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

              {hasPermission(PERMISSIONS.AFFILIATES.EDIT) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={() => navigate(`/affiliates/users/${affiliateUID}/edit`)}>
                      <PencilIcon className="size-4.5 stroke-1" />
                      <span>{t('edit')}</span>
                    </button>
                  )}
                </MenuItem>
              )}

              {hasPermission(PERMISSIONS.AFFILIATES.CHANGE_STATUS) && (
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
            </MenuItems>
          </Transition>
        </Menu>
      </div>
      <ConfirmModal
        show={changeStatusModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleChangeStatusRow}
        confirmLoading={confirmChangeStatusLoading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object
};
