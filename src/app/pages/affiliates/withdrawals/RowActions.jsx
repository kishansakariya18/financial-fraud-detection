// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { CheckCircleIcon, EllipsisHorizontalIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS } from 'constants/app.constant';
import usePermissions from 'app/router/usePermissions';
import AffiliatesService from 'services/affiliates.services';
import { toast } from 'sonner';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  // Modal state management
  const [modal, setModal] = useState({ type: null, open: false }); // type: 'accept' | 'reject'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const openModal = (type) => setModal({ type, open: true });
  const closeModal = useCallback(() => {
    if (loading) return;
    // Refresh list only after a successful action when user clicks Done
    if (success) {
      table?.options?.meta?.fetchNewList?.();
    }
    setModal({ type: null, open: false });
    setSuccess(false);
    setError(false);
    setLoading(false);
  }, [loading, success, table?.options?.meta]);

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);
      const transferUID = row?.original?.transactionUID;
      if (!transferUID) {
        throw new Error('Missing transferUID');
      }

      const payload = { transferUID };

      const result =
        modal.type === 'accept'
          ? await AffiliatesService.approveWithdrawal(payload)
          : await AffiliatesService.rejectWithdrawal(payload);

      if (result.status === 200) {
        setSuccess(true);
        toast.success(result?.response?.message || t('status') + ' ' + t('changed'));
      } else {
        setError(true);
        toast.error(result?.error || t('somethingWentWrong'));
      }
    } catch (e) {
      setError(true);
      toast.error(e?.message || t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, [modal.type, row?.original?.transactionUID, t]);

  const state = error ? 'error' : success ? 'success' : 'pending';

  // Confirmation messages (following pattern from email-provider RowActions)
  const acceptMessages = {
    pending: {
      title: t('areYouSure'),
      description: t('acceptWithdrawalDesc'),
      actionText: t('submit')
    },
    success: {
      title: t('success'),
      description: t('acceptWithdrawalSuccess'),
      actionText: t('done')
    },
    error: {
      title: t('status'),
      description: t('something_went_wrong')
    }
  };

  const rejectMessages = {
    pending: {
      title: t('areYouSure'),
      description: t('rejectWithdrawalDesc'),
      actionText: t('submit')
    },
    success: {
      title: t('success'),
      description: t('rejectWithdrawalSuccess'),
      actionText: t('done')
    },
    error: {
      title: t('status'),
      description: t('something_went_wrong')
    }
  };

  return (
    <>
      {row.original.transactionStatus === 'pending' && (
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
                  {hasPermission(PERMISSIONS.AFFILIATES.WITHDRAWALS_LIST) && (
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          className={clsx(
                            'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                            focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                          )}
                          onClick={() => openModal('accept')}>
                          <CheckCircleIcon className="size-4.5 stroke-1" />
                          <span>{t('accept')}</span>
                        </button>
                      )}
                    </MenuItem>
                  )}
                  {hasPermission(PERMISSIONS.AFFILIATES.WITHDRAWALS_LIST) && (
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          className={clsx(
                            'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                            focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                          )}
                          onClick={() => openModal('reject')}>
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
            messages={acceptMessages}
            onOk={handleConfirm}
            confirmLoading={loading}
            state={state}
          />
          <ConfirmModal
            show={modal.open && modal.type === 'reject'}
            onClose={closeModal}
            messages={rejectMessages}
            onOk={handleConfirm}
            confirmLoading={loading}
            state={state}
          />
        </>
      )}
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
