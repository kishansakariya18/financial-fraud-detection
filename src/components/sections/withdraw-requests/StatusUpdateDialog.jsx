import { useState } from 'react';
import { Button, Textarea } from 'components/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function StatusUpdateDialog({
  onClose,
  onConfirm,
  requestData,
  status, // 'settled' or 'rejected'
  loading = false
}) {
  const { t } = useTranslation();
  const [remarks, setRemarks] = useState('');

  const handleSubmit = () => {
    onConfirm({
      requestId: requestData?.requestId,
      status,
      remarks
    });
  };

  const handleClose = () => {
    setRemarks('');
    onClose();
  };
  console.log('requestData', requestData);

  const isApprove = status === 'settled';
  const confirmButtonText = isApprove ? t('approve') : t('reject');
  const confirmButtonColor = isApprove ? 'success' : 'error';

  return (
    <div>
      <div className="mt-4">
        <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t('request_id')}:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white">#{requestData?.requestId}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t('agent_name')}:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {requestData?.agentName || '-'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('amount')}:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(requestData?.amount || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('remarks')} {!isApprove && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                isApprove ? t('optional_approval_notes') : t('please_provide_rejection_reason')
              }
              rows={3}
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
          color={confirmButtonColor}
          onClick={handleSubmit}
          disabled={loading || (!isApprove && !remarks.trim())}
          loading={loading}>
          {confirmButtonText}
        </Button>
      </div>
    </div>
  );
}

StatusUpdateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  requestData: PropTypes.object,
  status: PropTypes.oneOf(['settled', 'rejected']).isRequired,
  loading: PropTypes.bool
};
