import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, EyeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export function RowActions({ row }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
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
                  onClick={() =>
                    navigate(`/user-manual-withdraw-transaction/view/${row.original.id}`)
                  }
                  className={clsx(
                    'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                    focus && 'bg-this/10 dark:bg-this-light/10'
                  )}>
                  <EyeIcon className="size-4.5 stroke-1" />
                  <span>{t('view')}</span>
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

RowActions.propTypes = { row: PropTypes.object };
