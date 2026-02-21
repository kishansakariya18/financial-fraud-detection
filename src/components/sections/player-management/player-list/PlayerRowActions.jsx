// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  CreditCardIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { CgUnblock, CgBlock } from 'react-icons/cg';
import { GrUpgrade } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';
import UserClassService from 'services/user-class.services';
import PlayerService from 'services/users.services';
import { isB2BPlatform } from 'utils/platformNavigation';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
export function PlayerRowActions({
  row,
  table,
  onView = null,
  onEdit = null,
  onChangeStatus = null,
  onCreditAmount = null,
  onResetPassword = null,
  listFor = 'admin'
}) {
  const { t } = useTranslation();
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [changeStatusSuccess, setChangeStatusSuccess] = useState(false);
  const [changeStatusError, setChangeStatusError] = useState(false);

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [upgradeError, setUpgradeError] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  // All upgradable target class IDs (as strings)
  const [allowedUpgradableIds, setAllowedUpgradableIds] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const isB2b = isB2BPlatform();
  const { hasPermission } = usePermissions();

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

  const closeUpgradeModal = () => {
    setUpgradeModalOpen(false);
  };

  const handleChangeStatus = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await onChangeStatus(row.original);
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

  // Derive current user's class id for display in modal
  const currentClassId = row?.original?.playerClassID || row?.original?.UserClassID;

  // Permission-gated action flags
  const canView = !!onView && hasPermission(PERMISSIONS.USER.LIST);
  const canEdit = !!onEdit && hasPermission(PERMISSIONS.USER.LIST);
  const canChangeStatus = !!onChangeStatus && hasPermission(PERMISSIONS.USER.CHANGE_STATUS);
  const canCreditAmount =
    !!onCreditAmount && listFor === 'agent' && hasPermission(PERMISSIONS.USER.ADD_MONEY);
  const canResetPassword = !!onResetPassword && listFor === 'agent';
  const canUpgradeUserClass = !isB2b && hasPermission(PERMISSIONS.USER.UPGRADE_USER_CLASS);
  const canShowActions =
    canView ||
    canEdit ||
    canChangeStatus ||
    canCreditAmount ||
    canResetPassword ||
    canUpgradeUserClass;

  const handleUpgrade = useCallback(async () => {
    if (!selectedClassId || !allowedUpgradableIds.includes(selectedClassId)) return;
    setUpgradeLoading(true);
    const nextIdNum = Number(selectedClassId);
    const payloadId = Number.isNaN(nextIdNum) ? selectedClassId : nextIdNum;
    const result = await PlayerService.upgradeUserClass({
      nextClassID: payloadId,
      userUID: row.original.userUID
    });
    if (result?.status === 200) {
      setUpgradeSuccess(true);
      toast.success(result?.response.message);
      // Refresh table data and summary to reflect new class immediately
      table.options.meta?.editRow?.();
      table.options.meta?.fetchSummary?.();
      // Optionally close the modal after showing success (kept commented to follow existing pattern)
      // setTimeout(() => setUpgradeModalOpen(false), 1500);
    } else {
      toast.error(result?.response.message);
    }
    setUpgradeLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, row]);
  // Fetch user classes when upgrade modal opens
  useEffect(() => {
    if (isB2b) return;
    const fetchClasses = async () => {
      const result = await UserClassService.userclassAllList();
      if (result?.status === 200) {
        const dataArr = result?.response?.data || result?.response?.Data || [];
        console.log('dataArr: ', dataArr);

        // Build enriched options with priority for upgrade logic
        const enriched = Array.isArray(dataArr)
          ? dataArr
              .map((cls) => {
                const value = cls?.UserClassID || cls?.id || cls?.UserClassId;
                const rawPriority = cls?.Priority ?? cls?.priority ?? null;
                const prNum = rawPriority != null ? Number(rawPriority) : null;
                const rawActive = cls?.isActive ?? cls?.IsActive ?? cls?.active ?? null;
                const activeNum = rawActive != null ? Number(rawActive) : null;
                return {
                  label: cls?.ClassName || cls?.title || cls?.Name || `Class ${value || ''}`,
                  value,
                  priority: Number.isNaN(prNum) ? null : prNum,
                  isActive:
                    rawActive === true ||
                    rawActive === 'true' ||
                    activeNum === 1 ||
                    rawActive === 1 ||
                    rawActive === '1'
                };
              })
              .filter((i) => i.value != null)
          : [];

        // Only show active classes in the modal
        const activeEnriched = enriched.filter((c) => c.isActive);

        // Determine current player's class priority
        const currentClassId = row?.original?.playerClassID || row?.original?.UserClassID;
        const currentClass = enriched.find((c) => c.value === currentClassId);
        const currPriority = currentClass?.priority ?? null;

        console.log('row?.original: ', row?.original);
        console.log('currentClass: ', currentClass);
        console.log('currPriority: ', currPriority);
        console.log('currentClass: ', currentClass);

        // Compute all higher priority classes (greater Priority value) among ACTIVE classes only
        const higher =
          currPriority != null
            ? activeEnriched.filter((c) => c.priority != null && c.priority > currPriority)
            : [];

        // Set options first to avoid any render race for controlled input (only active ones)
        setClassOptions(activeEnriched);

        // Track all upgradable targets and auto-select the nearest higher (smallest priority among higher)
        const upgradableIds = higher.map((c) => String(c.value));
        console.log('upgradableIds: ', upgradableIds);
        setAllowedUpgradableIds(upgradableIds);
        let defaultSelect = null;
        if (higher.length) {
          const nearest = higher.reduce((min, c) => (c.priority < min.priority ? c : min));
          defaultSelect = String(nearest.value);
        }
        // Auto-select nearest higher if available; else select current class
        setSelectedClassId(
          defaultSelect ?? (currentClassId != null ? String(currentClassId) : null)
        );
      } else {
        setClassOptions([]);
        setAllowedUpgradableIds([]);
        setSelectedClassId(null);
      }
    };
    if (upgradeModalOpen) {
      fetchClasses();
    }
  }, [upgradeModalOpen, row?.original?.playerClassID, row?.original?.UserClassID, row?.original]);

  // Keep selection in sync if allowedUpgradableIds change later
  useEffect(() => {
    if (upgradeModalOpen) {
      setSelectedClassId(
        (prev) =>
          prev ??
          (allowedUpgradableIds.length
            ? allowedUpgradableIds[0]
            : currentClassId != null
              ? String(currentClassId)
              : null)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedUpgradableIds]);

  return (
    <>
      {canShowActions && (
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
                className="absolute z-[100] w-[14rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
                {canView && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                          focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                        )}
                        onClick={() => onView(row.original)}>
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
                        onClick={() => onEdit(row.original)}>
                        <EyeIcon className="size-4.5 stroke-1" />
                        <span>{t('view')}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
                {canChangeStatus && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={openModal}
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                          focus && 'bg-this/10 dark:bg-this-light/10'
                        )}>
                        {row?.original?.status === 'blocked' ? (
                          <CgUnblock className="size-4.5 stroke-1" />
                        ) : (
                          <CgBlock className="size-4.5 stroke-1" />
                        )}
                        <span>
                          {row?.original?.status === 'blocked'
                            ? t('active') || 'Active'
                            : t('block') || 'Block'}
                        </span>
                      </button>
                    )}
                  </MenuItem>
                )}
                {canCreditAmount && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => onCreditAmount(row.original)}
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                          focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                        )}>
                        <CreditCardIcon className="size-4.5 stroke-1" />
                        <span>{t('credit_amount')}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
                {canResetPassword && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => onResetPassword(row.original)}
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                          focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                        )}>
                        <KeyIcon className="size-4.5 stroke-1" />
                        <span>{t('reset_password')}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
                {canUpgradeUserClass && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={openUpgrade}
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                          focus && 'bg-this/10 dark:bg-this-light/10'
                        )}>
                        <GrUpgrade className="size-4.5 stroke-1" />
                        <span>{t('upgrade_user_class') || 'Upgrade User Class'}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      )}

      <ConfirmModal
        show={changeStatusModalOpen}
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
            title: t('success') || 'User Class Upgraded',
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
        confirmDisabled={!selectedClassId || !allowedUpgradableIds.includes(selectedClassId)}
        state={upgradeState}>
        {upgradeState === 'pending' && (
          <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto text-left">
            {classOptions.length ? (
              classOptions.map((opt) => (
                <label key={opt.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="radio"
                    name="userClass"
                    value={String(opt.value)}
                    checked={selectedClassId === String(opt.value)}
                    onChange={() => setSelectedClassId(String(opt.value))}
                    disabled={
                      !allowedUpgradableIds.length ||
                      !allowedUpgradableIds.includes(String(opt.value))
                    }
                    className="size-4"
                  />
                  <span
                    className={clsx(
                      'flex items-center gap-2',
                      !allowedUpgradableIds.includes(String(opt.value)) && 'opacity-50'
                    )}>
                    {opt.label}
                    {String(opt.value) === String(currentClassId) && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {t('current') || 'Current'}
                      </span>
                    )}
                    {/* {allowedUpgradableIds.includes(String(opt.value)) && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {t('upgradable') || 'Upgradable'}
                      </span>
                    )} */}
                  </span>
                </label>
              ))
            ) : (
              <div className="text-sm text-gray-500 dark:text-dark-300">
                {t('no_data') || 'No data'}
              </div>
            )}
            {/* {allowedNextClassId == null && (
              <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                {t('no_higher_user_class_available') ||
                  'No higher user class available for upgrade.'}
              </div>
            )} */}
          </div>
        )}
      </ConfirmModal>
    </>
  );
}

PlayerRowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onCreditAmount: PropTypes.func,
  onResetPassword: PropTypes.func,
  listFor: PropTypes.string
};
