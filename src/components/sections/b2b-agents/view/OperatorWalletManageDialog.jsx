// Import Dependencies
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';

// Local Imports
import { Button, Input, Select, Textarea } from 'components/ui';
import b2bAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { CREDIT_DEBIT_TYPE } from 'constants/app.constant';
import { CustomModal } from 'components/custom';
import { useCurrencyContext } from 'app/contexts/currency/context';

// Validation Schema
const validationSchema = yup.object({
  creditDebitType: yup.string().required('Transaction type is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.01, 'Minimum amount is 0.01')
    .max(9999999, 'Maximum amount is reached'),
  reason: yup.string().optional().max(500, 'Reason cannot exceed 500 characters')
});

export function OperatorWalletManageDialog({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { symbol, formatCurrency } = useCurrencyContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      creditDebitType: 'credit',
      amount: '',
      reason: ''
    }
  });

  const watchedAmount = watch('amount');
  const watchedType = watch('creditDebitType');

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const creditDebitType =
      data.creditDebitType === 'credit' ? CREDIT_DEBIT_TYPE.CREDIT : CREDIT_DEBIT_TYPE.DEBIT;

    const payload = {
      amount: parseFloat(data.amount),
      creditDebitType,
      reason: data.reason || ''
    };

    try {
      const { response } = await b2bAgentWalletService.updateOperatorWallet(payload);
      toast.success(response.message || t('wallet_updated_successfully'));
      reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Operator wallet update error:', error);
      toast.error(error || `Failed to ${data.creditDebitType} amount. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const isCredit = watchedType === 'credit';
  const buttonColor = isCredit ? 'success' : 'error';

  return (
    <CustomModal show={isOpen} onClose={handleClose} title={t('wallet')}>
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
            label={t('amount')}
            placeholder="0.00"
            prefix={symbol}
            error={errors.amount?.message}
            className="text-lg font-medium"
          />
          {watchedAmount && (
            <p className="text-sm text-gray-600 dark:text-dark-300">
              {isCredit ? t('amount_to_credit') : t('amount_to_debit')}:
              <span
                className={`ml-1 font-semibold ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(watchedAmount || 0)}
              </span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            {...register('reason')}
            label={t('reason') + ' (' + t('optional') + ')'}
            placeholder={isCredit ? t('enter_reason_for_credit') : t('enter_reason_for_debit')}
            rows={4}
            error={errors.reason?.message}
          />
        </div>

        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-4 dark:border-dark-600">
          <Button type="button" onClick={handleClose} disabled={loading}>
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

OperatorWalletManageDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};
