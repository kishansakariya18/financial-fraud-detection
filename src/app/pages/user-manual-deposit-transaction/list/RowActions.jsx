// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button, Textarea } from 'components/ui';

import { useTranslation } from 'react-i18next';
import UserManualDepositTransactionService from 'services/user-manual-deposit-transaction.services';
import { toast } from 'sonner';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [modal, setModal] = useState({ type: null, open: false });
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const openModal = (type) => {
    setModal({ type, open: true });
  };

  const closeModal = () => {
    setModal({ type: null, open: false });
    setRejectionReason('');
    setSuccess(false);
    setError(false);
    setLoading(false);
  };

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    const payload = {
      id: row.original.id,
      depositStatus: modal.type === 'accept' ? 1 : 2
    };

    if (modal.type === 'reject') {
      payload.rejectionReason = rejectionReason;
    }

    const result = await UserManualDepositTransactionService.manualVerify(payload);

    if (result.status === 200) {
      toast.success(result.response.message);
      table.options.meta?.fetchNewList();
      setSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 1500);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [modal.type, rejectionReason, row.original.id, table.options.meta]);

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
              {row.original.depositStatus === 'pending' && (
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
              )}
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => {
                      navigate(`/user-manual-deposit-transaction/view/${row.original.id}`);
                    }}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                      focus && 'bg-this/10 dark:bg-this-light/10'
                    )}>
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>{t('view')}</span>
                  </button>
                )}
              </MenuItem>
              {row.original.depositStatus === 'pending' && (
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
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={modal.open && modal.type === 'accept'}
        onClose={closeModal}
        onOk={handleConfirm}
        confirmLoading={loading}
        state={state}
        messages={{
          pending: {
            description: 'Are you sure you want to accept this transaction?',
            actionText: t('submit')
          },
          success: {
            title: t('status') + ' ' + t('changed'),
            description: 'Transaction has been successfully accepted.'
          }
        }}
      />

      <ConfirmModal
        show={modal.open && modal.type === 'reject'}
        confirmDisabled={!rejectionReason.trim()}
        onClose={closeModal}
        title="Reject Transaction"
        onOk={handleConfirm}
        confirmLoading={loading}
        state={state}
        messages={{
          pending: {
            description: t('pleaseEnterRejectionReason'),
            actionText: t('submit')
          },
          success: {
            title: t('success'),
            description: t('transactionHasBeenSuccessfullyRejected')
          }
        }}>
        <div className="mt-4">
          <label
            htmlFor="rejectionReason"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('rejectionReason')}
          </label>
          <Textarea
            id="rejectionReason"
            name="rejectionReason"
            rows={3}
            className="mt-1"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            disabled={loading || success}
          />
        </div>
      </ConfirmModal>
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
