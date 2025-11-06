import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import { CustomModal } from 'components/custom';
import ViewModal from '../ViewModal';

import { ConfirmModal } from 'components/shared/ConfirmModal';
import { toast } from 'sonner';
import UserManualDepositTransactionService from 'services/user-manual-deposit-transaction.services';

export function RowActions({ row, table }) {
  const { t } = useTranslation();

  const [modal, setModal] = useState({ type: null, open: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onOpenDialogBox = () => {
    setIsDialogOpen(true);
  };
  const onCloseDialogBox = () => {
    setIsDialogOpen(false);
  };

  const openModal = (type) => setModal({ type, open: true });
  const closeModal = () => {
    setModal({ type: null, open: false });
    setSuccess(false);
    setError(false);
    setLoading(false);
  };

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    const payload = {
      id: row.original.id,
      status: modal.type === 'accept' ? 1 : 2
    };

    const result = await UserManualDepositTransactionService.manualWithdrawVerify(payload);
    if (result?.status === 200) {
      toast.success(result.response?.message || t('success'));
      table?.options?.meta?.fetchNewList?.();
      setSuccess(true);
      setTimeout(() => closeModal(), 1500);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [modal.type, row.original.id, table, t]);

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
                    onClick={onOpenDialogBox}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                      focus && 'bg-this/10 dark:bg-this-light/10'
                    )}>
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>{t('view')}</span>
                  </button>
                )}
              </MenuItem>
              {row.original.depositStatus === 0 && (
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

              {row.original.depositStatus === 0 && (
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

      <CustomModal
        show={isDialogOpen}
        title={t('user_manual_withdraw_transaction') + ' ' + t('details')}
        btnTitle={t('view_details') || t('view')}
        onClose={onCloseDialogBox}
        onOpen={onOpenDialogBox}
        hideOKButton>
        <ViewModal row={row.original} />
      </CustomModal>

      <ConfirmModal
        show={modal.open && modal.type === 'accept'}
        onClose={closeModal}
        onOk={handleConfirm}
        confirmLoading={loading}
        state={state}
        messages={{
          pending: {
            description:
              t('areYouSureYouWantToAcceptThisTransaction') ||
              'Are you sure you want to accept this transaction?',
            actionText: t('submit')
          },
          success: {
            title: t('status') + ' ' + t('changed'),
            description:
              t('transactionHasBeenSuccessfullyAccepted') ||
              'Transaction has been successfully accepted.'
          }
        }}
      />

      <ConfirmModal
        show={modal.open && modal.type === 'reject'}
        onClose={closeModal}
        onOk={handleConfirm}
        confirmLoading={loading}
        state={state}
        messages={{
          pending: {
            description:
              t('areYouSureYouWantToRejectThisTransaction') ||
              'Are you sure you want to reject this transaction?',
            actionText: t('submit')
          },
          success: {
            title: t('status') + ' ' + t('changed'),
            description: t('transactionHasBeenSuccessfullyRejected')
          }
        }}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired
};
