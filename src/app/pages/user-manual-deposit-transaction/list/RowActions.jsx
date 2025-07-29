// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';

import { useTranslation } from 'react-i18next';
import UserManualDepositTransactionService from 'services/user-manual-deposit-transaction.services';

export function RowActions({ row, table }) {
  const { t } = useTranslation();

  const [modalState, setModalState] = useState({ open: false, action: null });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const openModal = (action) => {
    setModalState({ open: true, action });
    setError(false);
    setSuccess(false);
  };

  const closeModal = () => {
    setModalState({ open: false, action: null });
  };

  const handleAction = useCallback(async () => {
    setLoading(true);
    const depositStatus = modalState.action === 'accept' ? 1 : 2;
    const result = await UserManualDepositTransactionService.manualVerify({
      id: row.original.id,
      depositStatus
    });
    if (result.status === 200) {
      table.options.meta?.fetchNewList();
      setSuccess(true);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [modalState.action, row.original.id, table.options.meta]);

  const confirmMessages = {
    pending: {
      description: `Are you sure you want to ${modalState.action} this transaction?`,
      actionText: t('submit')
    },
    success: {
      title: t('status') + ' ' + t('changed'),
      description: `Transaction has been successfully ${modalState.action}ed.`
    }
  };

  const state = error ? 'error' : success ? 'success' : 'pending';

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
                    onClick={() => openModal('accept')}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                      focus && 'bg-this/10 dark:bg-this-light/10'
                    )}>
                    <CheckCircleIcon className="size-4.5 stroke-1" />
                    <span>{t('accept')}</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => openModal('reject')}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                      focus && 'bg-this/10 dark:bg-this-light/10'
                    )}>
                    <XCircleIcon className="size-4.5 stroke-1" />
                    <span>{t('reject')}</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={modalState.open}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleAction}
        confirmLoading={loading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
