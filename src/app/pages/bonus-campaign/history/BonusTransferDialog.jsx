// Import Dependencies
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

// Local Imports
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import BonusCampaignService from 'services/bonus-campaign.services';
import { toast } from 'sonner';

export function BonusTransferDialog({ isOpen, onClose, grantData, onSuccess }) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState(null); // 'confirm' or 'reject'

  const handleConfirm = async () => {
    setAction('confirm');
    setIsProcessing(true);
    try {
      console.log('Confirming transfer for grant:', grantData.id);
      const result = await BonusCampaignService.processBonusTransfer({
        grantId: grantData.id,
        action: 1 // 1 = confirm
      });

      console.log('Confirm transfer result:', result);

      if (result.status === 200) {
        toast.success(t('bonusTransferConfirmed'));
        onSuccess?.();
        onClose();
      } else {
        const errorMsg = result.error || result.message || t('failedToConfirmBonusTransfer');
        console.error('Transfer confirmation failed:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error confirming bonus transfer:', error);
      toast.error(error.message || t('failedToConfirmBonusTransfer'));
    } finally {
      setIsProcessing(false);
      setAction(null);
    }
  };

  const handleReject = async () => {
    setAction('reject');
    setIsProcessing(true);
    try {
      console.log('Rejecting transfer for grant:', grantData.id);
      const result = await BonusCampaignService.processBonusTransfer({
        grantId: grantData.id,
        action: 0 // 0 = reject
      });

      console.log('Reject transfer result:', result);

      if (result.status === 200) {
        toast.success(t('bonusTransferRejected'));
        onSuccess?.();
        onClose();
      } else {
        const errorMsg = result.error || result.message || t('failedToRejectBonusTransfer');
        console.error('Transfer rejection failed:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error rejecting bonus transfer:', error);
      toast.error(error.message || t('failedToRejectBonusTransfer'));
    } finally {
      setIsProcessing(false);
      setAction(null);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark-800">
                <div className="flex items-center justify-between">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-50">
                    {t('bonusTransfer')}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-dark-700">
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-dark-300">
                    {t('bonusTransferConfirmationMessage')}
                  </p>

                  <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4 dark:bg-dark-700">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                        {t('username')}:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-dark-50">
                        {grantData?.userName || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                        {t('grantID')}:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-dark-50">
                        {grantData?.id || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                        {t('bonusAmount')}:
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-dark-50">
                        {grantData?.grantBonusAmount || 0}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-600 dark:text-dark-300">
                    {t('bonusTransferActionPrompt')}
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
                  <Button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 rtl:space-x-reverse">
                    <XCircleIcon className="size-4" />
                    <span>
                      {action === 'reject' && isProcessing ? t('rejecting') : t('reject')}
                    </span>
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 rtl:space-x-reverse">
                    <CheckCircleIcon className="size-4" />
                    <span>
                      {action === 'confirm' && isProcessing ? t('confirming') : t('confirm')}
                    </span>
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

BonusTransferDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  grantData: PropTypes.object,
  onSuccess: PropTypes.func
};
