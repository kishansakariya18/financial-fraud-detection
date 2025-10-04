// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, EyeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { TbStatusChange } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import PlayerService from 'services/player.services';
import UserClassService from 'services/user-class.services';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [chnageStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [changeStatusSuccess, setChangeStatusSuccess] = useState(false);
  const [changeStatusError, setChangeStatusError] = useState(false);
  // Upgrade User Class modal states
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [upgradeError, setUpgradeError] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const navigate = useNavigate();

  const confirmMessages = {
    pending: {
      description: t('player_status_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('player') + ' ' + t('status') + ' ' + t('changed'),
      description: t('player_status_suceess')
    }
  };

  const closeModal = () => {
    setChangeStatusModalOpen(false);
  };
  const closeUpgradeModal = () => {
    setUpgradeModalOpen(false);
  };

  const handleClickView = () => {
    navigate(`/users/player/${row.original.userUID}/${row.original.userID}/tab/details`);
  };

  const openModal = () => {
    setChangeStatusModalOpen(true);
    setChangeStatusError(false);
    setChangeStatusSuccess(false);
  };
  const openUpgrade = () => {
    setUpgradeModalOpen(true);
    setUpgradeError(false);
    setUpgradeSuccess(false);
    setSelectedClassId(null);
  };

  const handleChangeStatus = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await PlayerService.changePlayerStatus(row.original.userUID);
    if (result.status === 200) {
      table.options.meta?.changeStatus(row);
      setChangeStatusSuccess(true);
      table.options.meta?.fetchSummary();
    } else {
      setChangeStatusError(true);
    }

    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const state = changeStatusError ? 'error' : changeStatusSuccess ? 'success' : 'pending';
  const upgradeState = upgradeError ? 'error' : upgradeSuccess ? 'success' : 'pending';

  // Fetch user classes when upgrade modal opens
  useEffect(() => {
    const fetchClasses = async () => {
      const result = await UserClassService.userclassAllList();
      if (result?.status === 200) {
        const dataArr = result?.response?.data || result?.response?.Data || [];
        const options = Array.isArray(dataArr)
          ? dataArr
              .map((cls) => ({
                label:
                  cls?.ClassName || cls?.title || cls?.Name || `Class ${cls?.UserClassID || ''}`,
                value: cls?.UserClassID || cls?.id || cls?.UserClassId
              }))
              .filter((i) => i.value != null)
          : [];
        setClassOptions(options);
      } else {
        setClassOptions([]);
      }
    };
    if (upgradeModalOpen) {
      fetchClasses();
    }
  }, [upgradeModalOpen]);

  const handleUpgrade = useCallback(async () => {
    if (!selectedClassId) return;
    setUpgradeLoading(true);
    const result = await PlayerService.upgradeUserClass({
      nextClassID: selectedClassId,
      userUID: row.original.userUID
    });
    if (result?.status === 200) {
      setUpgradeSuccess(true);
      toast.success(result?.response.message);
      table.options.meta?.fetchSummary?.();
      // setTimeout(() => {
      //   setUpgradeModalOpen(false);
      // }, 1500);
    } else {
      toast.error(result?.response.message);
    }
    setUpgradeLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, row]);

  return (
    <>
      <div className="space-x-1.8 flex justify-center rtl:space-x-reverse">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} isIcon className="size-8 rounded-full">
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2">
            <MenuItems
              anchor={{ to: 'bottom end', gap: 12 }}
              className="absolute z-[100] w-[12rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              {hasPermission(PERMISSIONS.USER.LIST) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={handleClickView}>
                      <EyeIcon className="size-4.5 stroke-1" />
                      <span>{t('view')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {hasPermission(PERMISSIONS.USER.CHANGE_STATUS) &&
                row?.original?.status != 'inactive' && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={openModal}
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                          focus && 'bg-this/10 dark:bg-this-light/10'
                        )}>
                        <TbStatusChange className="size-4.5 stroke-1" />
                        <span>{t('change') + ' ' + t('status')}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
              {hasPermission(PERMISSIONS.USER.LIST) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openUpgrade}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-1 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}>
                      <TbStatusChange className="size-4.5 stroke-1" />
                      <span>{t('upgrade_user_class') || 'Upgrade User Class'}</span>
                    </button>
                  )}
                </MenuItem>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>
      <ConfirmModal
        show={chnageStatusModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleChangeStatus}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
      <ConfirmModal
        show={upgradeModalOpen}
        onClose={closeUpgradeModal}
        messages={{
          pending: {
            title: t('upgrade_user_class') || 'Upgrade User Class',
            description: t('select_user_class_to_upgrade') || 'Select a user class to assign',
            actionText: t('submit')
          },
          success: {
            title: t('user_class_upgraded') || 'User Class Upgraded',
            description:
              t('user_class_upgraded_successfully') ||
              'The user class has been updated successfully.'
          },
          error: {
            title: t('error') || 'Error',
            description:
              t('failed_to_upgrade_user_class') || 'Failed to update user class. Please try again.',
            actionText: t('retry') || 'Retry'
          }
        }}
        onOk={handleUpgrade}
        confirmLoading={upgradeLoading}
        confirmDisabled={!selectedClassId}
        state={upgradeState}>
        {upgradeState === 'pending' && (
          <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto text-left">
            {classOptions.length ? (
              classOptions.map((opt) => (
                <label key={opt.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="radio"
                    name="userClass"
                    value={opt.value}
                    checked={selectedClassId === opt.value}
                    onChange={() => setSelectedClassId(opt.value)}
                    className="size-4"
                  />
                  <span>{opt.label}</span>
                </label>
              ))
            ) : (
              <div className="text-sm text-gray-500 dark:text-dark-300">
                {t('no_data') || 'No data'}
              </div>
            )}
          </div>
        )}
      </ConfirmModal>
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
