import { useState } from 'react';
import { Button, Input } from 'components/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { toast } from 'sonner';

export default function WithdrawRequestDialog({ currentBalance, onSuccess, onCancel }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  //   const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(t('please_enter_valid_amount'));
      return;
    }

    if (parseFloat(amount) > currentBalance) {
      toast.error(t('insufficient_balance'));
      return;
    }

    setLoading(true);
    await B2BAgentWalletService.createWithdrawRequest({
      amount: parseFloat(amount)
    })
      .then(({ response }) => {
        toast.success(response.message);
        onSuccess?.();
      })
      .catch((error) => {
        toast.error(error || t('failed_to_submit_withdraw_request'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    setAmount('');
    onCancel();
  };

  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= currentBalance;

  return (
    <>
      <div className="mt-4">
        <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t('current_balance')}:
              </span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(currentBalance || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('withdraw_amount')} <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max={currentBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full"
            />
          </div>

          {/* <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('reason')} <span className="text-gray-400">({t('optional')})</span>
            </label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('enter_reason_for_withdraw')}
              className="w-full"
            />
          </div> */}
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
          {t('submit_withdraw_request')}
        </Button>
      </div>
    </>
  );
}

WithdrawRequestDialog.propTypes = {
  agentUID: PropTypes.string.isRequired,
  currentBalance: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
