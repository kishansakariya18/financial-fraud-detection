import { useState } from 'react';
import { Button, Input } from 'components/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function CreditAmountDialog({ onClose, onConfirm, playerData, loading = false }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  //   const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    onConfirm({
      playerUID: playerData?.userUID,
      amount: parseFloat(amount)
      //   reason: reason.trim() || t('credit_added_by_agent')
    });
  };

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  const isValidAmount = amount && parseFloat(amount) > 0;

  return (
    <>
      <div className="mt-4">
        <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('player')}:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {playerData?.username || playerData?.firstName || '-'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('user_id')}:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {playerData?.userID || '-'}
              </span>
            </div>
            {playerData?.currentBalance !== undefined && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {t('current_balance')}:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(playerData.currentBalance || 0)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('amount_to_credit')} <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outlined" onClick={handleClose} disabled={loading}>
          {t('cancel')}
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !isValidAmount}
          loading={loading}>
          {t('credit_amount')}
        </Button>
      </div>
    </>
  );
}

CreditAmountDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  playerData: PropTypes.object,
  loading: PropTypes.bool
};
