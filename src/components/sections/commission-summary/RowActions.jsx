// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, CurrencyDollarIcon, EyeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';

// Local Imports
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import AgentService from 'services/agent.services';
import { useSelector } from 'react-redux';
import { ADMIN_TYPE } from 'constants/app.constant';

export function RowActions({ row, onRefresh }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { agentUID } = useParams();
  const { userData } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState('pending');

  const isAgent = useMemo(() => userData?.AdminType === ADMIN_TYPE.AGENT, [userData?.AdminType]);

  const summaryData = row.original;

  // Check if redeem action should be shown
  const canRedeem = () => {
    if (!isAgent || summaryData.redeemRequestDetails) {
      return false;
    }

    // Don't show if period hasn't ended
    const periodEnd = new Date(summaryData.periodEnd);
    const now = new Date();
    if (periodEnd > now) return false;

    // Don't show if commission amount is 0 or negative
    if (!summaryData.commissionAmount || summaryData.commissionAmount <= 0) return false;

    return true;
  };

  // Modal handlers
  const openConfirmModal = () => {
    setConfirmState('pending');
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    if (!isLoading) {
      setConfirmModalOpen(false);
      setConfirmState('pending');
    }
  };

  const handleRedeemRequest = async () => {
    try {
      setIsLoading(true);

      const result = await AgentService.redeemCommissionRequest(summaryData.id);

      if (result.status === 200) {
        setConfirmState('success');
        closeConfirmModal();
        if (onRefresh) {
          onRefresh();
        }
      } else {
        setConfirmState('error');
        toast.error(result.error || t('failed_to_submit_redeem_request'));
      }
    } catch (error) {
      console.error('Error submitting redeem request:', error);
      setConfirmState('error');
      toast.error(error?.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view details navigation
  const handleViewDetails = () => {
    if (isAgent) {
      navigate(`/calling-agents/summary/${summaryData.id}/details`, {
        state: { summaryData }
      });
    } else if (agentUID) {
      navigate(`/calling-agents/list/${agentUID}/commission-summary/${summaryData.id}/details`, {
        state: { summaryData }
      });
    }
  };

  // Confirm modal messages
  const confirmMessages = {
    pending: {
      title: t('confirm_redeem_commission_request'),
      description: `${t('are_you_sure_redeem_commission')}`,
      actionText: t('redeem_commission_request')
    },
    success: {
      title: t('redeem_request_submitted'),
      description: t('redeem_request_submitted_successfully'),
      actionText: t('done')
    }
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
            className="absolute z-[100] w-[14rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                    focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                  )}
                  onClick={handleViewDetails}>
                  <EyeIcon className="size-4.5 stroke-1" />
                  <span>{t('view_details')}</span>
                </button>
              )}
            </MenuItem>

            {canRedeem() && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}
                    onClick={openConfirmModal}
                    disabled={isLoading}>
                    <CurrencyDollarIcon className="size-4.5 stroke-1" />
                    <span>{isLoading ? t('submitting') : t('redeem_commission_request')}</span>
                  </button>
                )}
              </MenuItem>
            )}
          </MenuItems>
        </Transition>
      </Menu>

      <ConfirmModal
        show={confirmModalOpen}
        onClose={closeConfirmModal}
        messages={confirmMessages}
        onOk={handleRedeemRequest}
        confirmLoading={isLoading}
        state={confirmState}
      />
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
  onRefresh: PropTypes.func
};
