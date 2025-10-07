// Import Dependencies
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { KeyIcon } from '@heroicons/react/24/outline';

// Local Imports
import { Button, Input, Textarea, Select } from 'components/ui';
import b2bAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { CREDIT_DEBIT_TYPE } from 'constants/app.constant';
import { CustomModal } from 'components/custom';
import { useCurrencyContext } from 'app/contexts/currency/context';

// Validation Schema
const validationSchema = yup.object({
  creditDebitType: yup
    .string()
    .required('Transaction type is required')
    .oneOf(['credit', 'debit'], 'Invalid transaction type'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.001, 'Amount must be greater than 0')
    .max(9999999, 'Maximum amount is reached'),
  remarks: yup
    .string()
    .required('Remarks are required')
    .max(500, 'Remarks cannot exceed 500 characters'),
  password: yup.string().required('Password is required')
});

export function ManualAdjustmentForm({ agentUID, onClose, isOpen }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { symbol, formatCurrency } = useCurrencyContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      creditDebitType: 'credit',
      amount: null,
      remarks: '',
      password: ''
    }
  });

  const watchedAmount = watch('amount');
  const watchedType = watch('creditDebitType');

  const onSubmit = async (data) => {
    setLoading(true);

    const creditDebitType =
      data.creditDebitType === 'credit' ? CREDIT_DEBIT_TYPE.CREDIT : CREDIT_DEBIT_TYPE.DEBIT;

    try {
      const response = await b2bAgentWalletService.manualAdjustment({
        agentUID,
        type: creditDebitType,
        amount: parseFloat(data.amount),
        remarks: data.remarks,
        password: data.password
      });

      toast.success(
        response.response?.message || `${t('commission_balance')} adjustment successful`
      );
      onClose({ isRefresh: true });
    } catch (error) {
      console.error('Manual adjustment error:', error);
      toast.error(error || `Failed to adjust ${t('commission_balance')}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const isCredit = watchedType === 'credit';
  const buttonColor = isCredit ? 'success' : 'error';

  useEffect(() => {
    reset({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <CustomModal show={isOpen} onClose={onClose} title={t('adjust_commission_balance')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Type Selection */}
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

        {/* Amount Input */}
        <div className="space-y-2">
          <Input
            {...register('amount')}
            type="number"
            step="0.01"
            min="0.01"
            max="999999.99"
            label={t('amount')}
            placeholder="0.00"
            prefix={symbol}
            error={errors.amount?.message}
            className="text-lg font-medium"
          />
          {watchedAmount && (
            <p className="text-sm text-gray-600">
              {isCredit ? t('amount_to_credit') : t('amount_to_debit')}:
              <span
                className={`ml-1 font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(watchedAmount || 0)}
              </span>
            </p>
          )}
        </div>

        {/* Remarks Input */}
        <div className="space-y-2">
          <Textarea
            {...register('remarks')}
            label={t('remarks')}
            placeholder={isCredit ? t('enter_reason_for_credit') : t('enter_reason_for_debit')}
            rows={4}
            error={errors.remarks?.message}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Input
            {...register('password')}
            type="password"
            label={t('password')}
            placeholder={t('enter') + ' ' + t('password')}
            prefix={<KeyIcon className="h-5 w-5" />}
            error={errors.password?.message}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
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
              : `${isCredit ? t('credit') : t('debit')} ${t('commission_balance')}`}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

ManualAdjustmentForm.propTypes = {
  agentUID: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
