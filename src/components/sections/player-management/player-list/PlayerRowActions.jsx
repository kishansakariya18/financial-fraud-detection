// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  CreditCardIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { TbStatusChange } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
export function PlayerRowActions({
  row,
  table,
  onView = null,
  onEdit = null,
  onChangeStatus = null,
  onCreditAmount = null,
  onResetPassword = null,
  listFor = 'admin'
}) {
  const { t } = useTranslation();
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [changeStatusSuccess, setChangeStatusSuccess] = useState(false);
  const [changeStatusError, setChangeStatusError] = useState(false);

  const confirmMessages = {
    pending: {
      description: t('player_status_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('player') + ' ' + t('status') + ' ' + t('changed'),
      description: t('player_status_suceess')
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

  const handleChangeStatus = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await onChangeStatus(row.original);
    if (result.status === 200) {
      table.options.meta?.changeStatus(row);
      setChangeStatusSuccess(true);
      table.options.meta?.fetchSummary();
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
              className="absolute z-[100] w-[12rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              {onView && (
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
              {onEdit && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={() => onEdit(row.original)}>
                      <EyeIcon className="size-4.5 stroke-1" />
                      <span>{t('view')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {console.log('row?.options?.status ::> ', row?.original?.status)}
              {onChangeStatus && row?.original?.status != 'inactive' && (
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
              {onCreditAmount && listFor === 'agent' && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => onCreditAmount(row.original)}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}>
                      <CreditCardIcon className="size-4.5 stroke-1" />
                      <span>{t('credit_amount')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {onResetPassword && listFor === 'agent' && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => onResetPassword(row.original)}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}>
                      <KeyIcon className="size-4.5 stroke-1" />
                      <span>{t('reset_password')}</span>
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
        onOk={handleChangeStatus}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );
}

PlayerRowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onCreditAmount: PropTypes.func,
  onResetPassword: PropTypes.func,
  listFor: PropTypes.string
};
