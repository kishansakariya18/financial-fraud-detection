// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import { CustomModal } from 'components/custom';
import { ViewDetails } from './ViewDetails';

export function RowActions({ row }) {
  const { t } = useTranslation();
  const wallet = row.original;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const onOpenDialogBox = () => {
    setIsDialogOpen(true);
  };

  const onCloseDialogBox = () => {
    setIsDialogOpen(false);
  };

  const onOpenStatusDialog = (type) => {
    setActionType(type);
    setIsStatusDialogOpen(true);
  };

  const onCloseStatusDialog = () => {
    setIsStatusDialogOpen(false);
    setActionType('');
  };

  const onConfirmStatusChange = async () => {
    // Handle wallet status change here
    console.log(`${actionType} wallet:`, wallet.id);
    // Add your API call here
    setIsStatusDialogOpen(false);
    setActionType('');
  };

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
                    type="button"
                    onClick={onOpenDialogBox}
                    className={clsx(
                      'flex w-full items-center px-3 py-2 text-sm',
                      focus
                        ? 'bg-gray-100 text-gray-900 dark:bg-dark-600 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    )}>
                    <EyeIcon className="mr-3 size-4" aria-hidden="true" />
                    {t('view_details')}
                  </button>
                )}
              </MenuItem>

              {wallet.status === 'active' && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => onOpenStatusDialog('freeze')}
                      className={clsx(
                        'flex w-full items-center px-3 py-2 text-sm',
                        focus
                          ? 'bg-gray-100 text-gray-900 dark:bg-dark-600 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      )}>
                      <LockClosedIcon className="mr-3 size-4" aria-hidden="true" />
                      {t('freeze_wallet')}
                    </button>
                  )}
                </MenuItem>
              )}

              {wallet.status === 'frozen' && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => onOpenStatusDialog('unfreeze')}
                      className={clsx(
                        'flex w-full items-center px-3 py-2 text-sm',
                        focus
                          ? 'bg-gray-100 text-gray-900 dark:bg-dark-600 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      )}>
                      <LockOpenIcon className="mr-3 size-4" aria-hidden="true" />
                      {t('unfreeze_wallet')}
                    </button>
                  )}
                </MenuItem>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {/* View Details Modal */}
      <CustomModal
        isOpen={isDialogOpen}
        onClose={onCloseDialogBox}
        title={t('wallet_details')}
        size="lg">
        <ViewDetails wallet={wallet} onClose={onCloseDialogBox} />
      </CustomModal>

      {/* Status Change Confirmation Modal */}
      <CustomModal
        isOpen={isStatusDialogOpen}
        onClose={onCloseStatusDialog}
        title={t('confirm_action')}
        size="sm">
        <div className="p-4">
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {actionType === 'freeze'
              ? t('confirm_freeze_wallet', { currency: wallet.currencyName })
              : t('confirm_unfreeze_wallet', { currency: wallet.currencyName })}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onCloseStatusDialog}>
              {t('cancel')}
            </Button>
            <Button
              variant={actionType === 'freeze' ? 'destructive' : 'default'}
              onClick={onConfirmStatusChange}>
              {actionType === 'freeze' ? t('freeze') : t('unfreeze')}
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
