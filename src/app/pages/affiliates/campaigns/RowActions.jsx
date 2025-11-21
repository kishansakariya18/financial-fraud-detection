// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, EyeIcon } from '@heroicons/react/24/outline';
import { TbUsersPlus } from 'react-icons/tb';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TbStatusChange } from 'react-icons/tb';
import AffiliatesService from 'services/affiliates.services';

export function RowActions({ row, table }) {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const affiliateUID = row?.original?.affiliates?.AffiliateUID;
  const campaignUID = row?.original?.CampaignCode;
  const campaignID = row?.original?.campaignStats?.CampaignID;
  const { t } = useTranslation();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [confirmStatusLoading, setConfirmStatusLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const confirmMessages = {
    pending: {
      description: t('campaign_status_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('success'),
      description: t('campaign') + ' ' + t('status') + ' ' + t('changed')
    }
  };

  const goToDetails = () => {
    navigate(`/affiliates/users/${affiliateUID}/tab/campaigns/${campaignUID}/detail`);
  };

  const goToReferredUsers = () => {
    navigate(`/affiliates/users/${affiliateUID}/tab/campaigns/${campaignID}/referred_users`);
  };

  const openStatusModal = () => {
    setStatusModalOpen(true);
    setStatusError(false);
    setStatusSuccess(false);
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
  };

  const handleChangeStatus = useCallback(async () => {
    setConfirmStatusLoading(true);
    const result = await AffiliatesService.changeCampaignStatus(campaignUID);
    if (result.status === 200) {
      table?.options?.meta?.deleteRow?.(row);
      setStatusSuccess(true);
    } else {
      setStatusError(true);
    }
    setConfirmStatusLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignUID, row]);

  const state = statusError ? 'error' : statusSuccess ? 'success' : 'pending';

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
              className="absolute z-[100] w-[12rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              {hasPermission(PERMISSIONS.AFFILIATES.CAMPAIGN.VIEW) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={goToDetails}>
                      <EyeIcon className="size-4.5 stroke-1" />
                      <span>{t('view')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {hasPermission(PERMISSIONS.AFFILIATES?.USER_SIGNUP_LIST) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={goToReferredUsers}>
                      <TbUsersPlus className="size-4.5 stroke-1" />
                      <span>{t('referred_users')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {hasPermission(PERMISSIONS.AFFILIATES?.CAMPAIGN.CHANGE_STATUS) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openStatusModal}
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
            </MenuItems>
          </Transition>
        </Menu>
      </div>
      <ConfirmModal
        show={statusModalOpen}
        onClose={closeStatusModal}
        messages={confirmMessages}
        onOk={handleChangeStatus}
        confirmLoading={confirmStatusLoading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
