// Import Dependencies
import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

// Local Imports
import { Button, Input, Select, Textarea } from 'components/ui';
import b2bAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { ADMIN_TYPE, CREDIT_DEBIT_TYPE } from 'constants/app.constant';
import { useSelector } from 'react-redux';
import { CustomModal } from 'components/custom';

// Validation Schema
const validationSchema = yup.object({
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.01, 'Minimum amount is $0.01')
    .max(9999999, 'Maximum amount is reached'),
  reason: yup.string().optional().max(500, 'Reason cannot exceed 500 characters')
});

export function CreditDebitForm({ agentUID, onCancel, isOpen }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const isAdmin = useMemo(() => userData?.AdminType === ADMIN_TYPE.ADMIN, [userData?.AdminType]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: '',
      reason: ''
    }
  });

  const watchedAmount = watch('amount');

  const onSubmit = async (data) => {
    setLoading(true);
    const creditDebitType =
      data.creditDebitType === 'credit' ? CREDIT_DEBIT_TYPE.CREDIT : CREDIT_DEBIT_TYPE.DEBIT;

    let res = null;
    if (isAdmin) {
      res = b2bAgentWalletService.adminAddCreditDebit({
        agentUID,
        amount: parseFloat(data.amount),
        creditDebitType
      });
    } else {
      res = b2bAgentWalletService.agentAddCreditDebit({
        agentUID,
        amount: parseFloat(data.amount),
        creditDebitType
      });
    }

    await res
      .then(({ response }) => {
        toast.success(response.message);
        onCancel({ isRefresh: true });
      })
      .catch((error) => {
        console.error('Transaction error:', error);
        toast.error(error || `Failed to ${data.creditDebitType} amount. Please try again.`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isCredit = watch('creditDebitType') === 'credit';
  const buttonColor = isCredit ? 'success' : 'error';

  return (
    <CustomModal show={isOpen} onClose={onCancel} title={t('adjust_lineup_balance')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Select
            {...register('creditDebitType')}
            label={t('type')}
            error={errors.creditDebitType?.message}
            data={[
              { value: 'credit', label: t('credit') },
              { value: 'debit', label: t('debit') }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Input
            {...register('amount')}
            type="number"
            step="0.01"
            min="0.01"
            max="999999.99"
            label={t('amount')}
            placeholder="0.00"
            prefix={<CurrencyDollarIcon className="h-5 w-5" />}
            error={errors.amount?.message}
            className="text-lg font-medium"
          />
          {watchedAmount && (
            <p className="text-sm text-gray-600">
              {isCredit ? t('amount_to_credit') : t('amount_to_debit')}:
              <span
                className={`ml-1 font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                ${parseFloat(watchedAmount || 0).toFixed(2)}
              </span>
            </p>
          )}
        </div>

        {/* Reason Input */}
        <div className="space-y-2">
          <Textarea
            {...register('reason')}
            label={t('reason')}
            placeholder={isCredit ? t('enter_reason_for_credit') : t('enter_reason_for_debit')}
            rows={4}
            error={errors.reason?.message}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            color={buttonColor}
            loading={loading}
            disabled={!watchedAmount || parseFloat(watchedAmount || 0) <= 0}>
            {loading
              ? isCredit
                ? t('crediting')
                : t('debiting')
              : isCredit
                ? t('credit_amount')
                : t('debit_amount')}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

CreditDebitForm.propTypes = {
  agentUID: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['credit', 'debit']).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
