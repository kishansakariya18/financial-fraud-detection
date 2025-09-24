// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, UsersIcon, EyeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { Button } from 'components/ui';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { useNavigate } from 'react-router';

export function RowActions({ row }) {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const affiliateUID = row?.original?.affiliateUID;

  const goToUsers = () => {
    navigate(`/affiliates/${affiliateUID}/users`);
  };
  const goToDetails = () => {
    navigate(`/affiliates/${affiliateUID}/detail`);
  };

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
            className="absolute z-[100] w-[12rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
            {hasPermission(PERMISSIONS.AFFILIATES?.LIST) && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}
                    onClick={goToDetails}>
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>View</span>
                  </button>
                )}
              </MenuItem>
            )}
            {(hasPermission(PERMISSIONS.AFFILIATES?.USER_SIGNUP_LIST) ||
              hasPermission(PERMISSIONS.AFFILIATES?.LIST)) && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}
                    onClick={goToUsers}>
                    <UsersIcon className="size-4.5 stroke-1" />
                    <span>Users</span>
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
  row: PropTypes.object
};
