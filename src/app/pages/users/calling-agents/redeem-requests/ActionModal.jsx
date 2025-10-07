import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { CustomModal } from 'components/custom';
import { Textarea, Input, Button } from 'components/ui';
import { Radio } from 'components/ui';

// Validation schemas
// approvedAmount is required only when adjustAmount is true
const approveSchema = Yup.object().shape({
  approvedAmount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .when('$adjust', {
      is: true,
      then: (schema) =>
        schema.required('Approved amount is required').min(0, 'Amount must be positive'),
      otherwise: (schema) => schema.notRequired()
    }),
  remarks: Yup.string().max(500, 'Remarks cannot exceed 500 characters')
});

const rejectSchema = Yup.object().shape({
  remarks: Yup.string().max(500, 'Remarks cannot exceed 500 characters')
});

const settleSchema = Yup.object().shape({
  remarks: Yup.string().max(500, 'Remarks cannot exceed 500 characters')
});

const ActionModal = ({ show, type, request, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(false);

  const getSchema = () => {
    switch (type) {
      case 'approve':
        return approveSchema;
      case 'reject':
        return rejectSchema;
      case 'settle':
        return settleSchema;
      default:
        return approveSchema;
    }
  };

  const schema = getSchema();
  const isApprove = type === 'approve';
  const isReject = type === 'reject';

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError
  } = useForm({
    resolver: yupResolver(schema, { context: { adjust: adjustAmount } }),
    defaultValues: {
      remarks: '',
      ...(isApprove && { approvedAmount: request?.requestedAmount })
    }
  });

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Basic guard when adjustment is enabled
      if (adjustAmount) {
        const amt = Number(data.approvedAmount);
        if (Number.isNaN(amt) || amt < 0) {
          setError('approvedAmount', {
            type: 'manual',
            message: t('Approved amount is required and must be >= 0')
          });
          return;
        }
      }

      // Add status to the data based on action type or custom status
      const statusData = {
        ...data,
        status:
          data?.customStatus ||
          (type === 'approve' ? 'approved' : type === 'reject' ? 'rejected' : 'settled')
      };
      const result = await onSubmit(statusData);
      if (result?.success) {
        setIsSuccess(true);
        reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveAndSettle = async () => {
    const formData = {
      approvedAmount: adjustAmount ? watch('approvedAmount') : request?.requestedAmount,
      remarks: watch('remarks')
    };
    await handleFormSubmit({ ...formData, customStatus: 'settled' });
  };

  const getModalTitle = () => {
    switch (type) {
      case 'approve':
        return t('approve_request');
      case 'reject':
        return t('reject_request');
      case 'settle':
        return t('settle_request');
      default:
        return t('update_request');
    }
  };

  const modalTitle = getModalTitle();

  const handleClose = () => {
    setIsSuccess(false);
    reset();
    onClose();
  };

  return (
    <CustomModal show={show} onClose={handleClose} title={modalTitle}>
      {isSuccess ? (
        <div>
          <div className="text-center">
            <h4 className="mb-2">{t('success')}</h4>
            <p>{t('request_status_updated_successfully')}</p>
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={handleClose} color="primary">
              {t('done')}
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mt-4 space-y-4"
          autoComplete="off">
          {/* Request Information */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-dark-700">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-300">Request ID:</span>
                <span className="font-medium">{request?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-300">Agent:</span>
                <span className="font-medium">{request?.agentInfo?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-300">Requested Amount:</span>
                <span className="font-medium">
                  ${parseFloat(request?.requestedAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-300">Status:</span>
                <span className="font-medium capitalize">{request?.status}</span>
              </div>
            </div>
          </div>

          {/* Amount Adjustment (approve action) */}
          {isApprove && (
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700 dark:text-dark-200">
                  {t('adjust_amount') || 'Adjust amount'}?
                </span>
                <Radio
                  name="adjustAmount"
                  label={t('no')}
                  checked={!adjustAmount}
                  onChange={() => setAdjustAmount(false)}
                />
                <Radio
                  name="adjustAmount"
                  label={t('yes')}
                  checked={adjustAmount}
                  onChange={() => setAdjustAmount(true)}
                />
              </div>

              <Controller
                name="approvedAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                    label={t('approved_amount')}
                    placeholder="0.00"
                    disabled={!adjustAmount}
                    error={errors?.approvedAmount?.message}
                  />
                )}
              />
            </div>
          )}

          {/* Remarks */}
          <Controller
            name="remarks"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label={t('remarks') + (isReject ? '' : ' (' + t('optional') + ')')}
                placeholder={
                  isReject
                    ? t('reason_for_rejection')
                    : isApprove
                      ? t('optional_remarks')
                      : t('optional_remarks')
                }
                rows={3}
                error={errors?.remarks?.message}
              />
            )}
          />

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={handleClose} disabled={isSubmitting}>
              {t('cancel')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={isSubmitting}>
              {isSubmitting ? t('processing') + '...' : modalTitle}
            </Button>
            {isApprove && (
              <Button
                type="button"
                className="min-w-[7rem]"
                color="success"
                disabled={isSubmitting}
                onClick={handleApproveAndSettle}>
                {isSubmitting ? t('processing') + '...' : t('approve_and_settle')}
              </Button>
            )}
          </div>
        </form>
      )}
    </CustomModal>
  );
};

ActionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['approve', 'reject', 'settle']).isRequired,
  request: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ActionModal;
