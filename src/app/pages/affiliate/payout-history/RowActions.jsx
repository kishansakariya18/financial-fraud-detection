// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { CustomModal } from 'components/custom';
import UpdatePayout from './UpdatePayout';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onOpenDialogBox = () => {
    setIsDialogOpen(true);
  };
  const onCloseDialogBox = () => {
    setIsDialogOpen(false);
  };

  const onOkDialogBox = async () => {
    table.options.meta?.editRow(row);
    setIsDialogOpen(false);
  };

  return (
    <>
      {row.original?.status === 'pending' && (
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
                {hasPermission(PERMISSIONS.AFFILIATES.UPDATE_PAYTOUT) && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                          focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                        )}
                        onClick={onOpenDialogBox}>
                        <EyeIcon className="size-4.5 stroke-1" />
                        <span>{t('view')}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      )}

      <CustomModal
        show={isDialogOpen}
        title={t('update') + ' ' + t('payout')}
        btnTitle={t('update') + ' ' + t('update')}
        icon={<PencilIcon className="size-4.5 stroke-1" />}
        btnClassName={clsx(
          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
          focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
        )}
        onClose={onCloseDialogBox}
        onOpen={onOpenDialogBox}
        onOk={onOkDialogBox}>
        <UpdatePayout
          transactionId={row.original.id}
          onClose={onCloseDialogBox}
          onOk={onOkDialogBox}
          affiliate={table.getState()?.affiliate}
          row={row}
        />
      </CustomModal>
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
