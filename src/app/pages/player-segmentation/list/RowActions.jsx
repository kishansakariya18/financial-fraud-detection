import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { Button } from 'components/ui';

export function PlayerSegmentationRowActions({ row, table }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  console.log('row: ', row);
  console.log('table: ', table);

  const canView = hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.LIST);
  const canEdit = hasPermission(PERMISSIONS.PLAYER_SEGMENTATION.EDIT);
  // TODO: Add DELETE permission when available
  const canDelete = false;

  const handleView = () => {
    // TODO: Add view navigation
    navigate(`/player-segmentation/${row.original.id}/view`);
  };

  const handleEdit = () => {
    // TODO: Add edit navigation
    navigate(`/player-segmentation/${row.original.id}/edit`);
  };

  const handleDelete = () => {
    // TODO: Add delete functionality
    console.log('Delete:', row.original);
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
            {canView && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}
                    onClick={handleView}>
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>{t('view')}</span>
                  </button>
                )}
              </MenuItem>
            )}

            {canEdit && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}
                    onClick={handleEdit}>
                    <PencilSquareIcon className="size-4.5 stroke-1" />
                    <span>{t('edit') || 'Edit'}</span>
                  </button>
                )}
              </MenuItem>
            )}

            {canDelete && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handleDelete}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-error outline-none transition-colors dark:text-error-light rtl:space-x-reverse',
                      focus && 'bg-error/10 dark:bg-error-light/10'
                    )}>
                    <TrashIcon className="size-4.5 stroke-1" />
                    <span>{t('delete')}</span>
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

PlayerSegmentationRowActions.propTypes = {
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired
};
