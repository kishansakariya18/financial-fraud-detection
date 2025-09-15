// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  CheckIcon,
  XMarkIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';

export function RowActions({ row, onApprove, onReject, onSettle }) {
  const { t } = useTranslation();
  const request = row.original;
  const status = request.status;

  // Terminal states - no actions allowed
  if (status === 'settled' || status === 'rejected') {
    return <span className="text-gray-500 dark:text-dark-400">-</span>;
  }

  return (
    <div className="flex justify-center">
      <Menu>
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
            {status === 'pending' && (
              <>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => onApprove(request)}
                      className={clsx(
                        'text-primary dark:text-primary-light flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-primary/10 dark:bg-primary-light/10'
                      )}>
                      <CheckIcon className="size-4.5 stroke-1" />
                      <span>{t('approve')}</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => onReject(request)}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-error outline-none transition-colors dark:text-error-light rtl:space-x-reverse',
                        focus && 'bg-error/10 dark:bg-error-light/10'
                      )}>
                      <XMarkIcon className="size-4.5 stroke-1" />
                      <span>{t('reject')}</span>
                    </button>
                  )}
                </MenuItem>
              </>
            )}

            {status === 'approved' && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => onSettle(request)}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-success outline-none transition-colors dark:text-success-light rtl:space-x-reverse',
                      focus && 'bg-success/10 dark:bg-success-light/10'
                    )}>
                    <BanknotesIcon className="size-4.5 stroke-1" />
                    <span>{t('settle')}</span>
                  </button>
                )}
              </MenuItem>
            )}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onSettle: PropTypes.func.isRequired
};
