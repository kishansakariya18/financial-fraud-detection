// Import Dependencies
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// Local Imports
import { Button } from 'components/ui';
import { Page } from 'components/shared/Page';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export function ViewDetailsModal({ summaryData, onClose }) {
  const { t } = useTranslation();
  const pageTitle = t('commission_summary') + ' ' + t('details');

  if (!summaryData) return null;

  const redeemRequest = summaryData.redeemRequestDetails;

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] pb-8">
        <div className="col-span-12">
          {/* Commission Summary Details */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('summary') + ' ID'}
              </p>
              <p className="font-medium">{summaryData.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('target_name')}
              </p>
              <p className="font-medium">{summaryData.targetName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('event_name')}
              </p>
              <p className="font-medium">{summaryData.eventName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('period_start')}
              </p>
              <p className="font-medium">{getDateInUTCToTimeZone(summaryData.periodStart)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('period_end')}
              </p>
              <p className="font-medium">{summaryData.periodEnd}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('total_event_amount')}
              </p>
              <p className="font-medium">{summaryData.totalEventAmount || '0'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('commission') + ' Amount'}
              </p>
              <p className="font-medium text-green-600 dark:text-green-400">
                {summaryData.commissionAmount || '0'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('calculated_at')}
              </p>
              <p className="font-medium">{summaryData.calculatedAt}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('redeem_status')}
              </p>
              <p className="font-medium">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    summaryData.isRedeemed === 'redeemed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : summaryData.isRedeemed === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                  {summaryData.isRedeemed === 'redeemed'
                    ? t('redeemed')
                    : summaryData.isRedeemed === 'pending'
                      ? t('pending')
                      : t('not_redeemed')}
                </span>
              </p>
            </div>
          </div>

          {/* Redeem Request Details */}
          {redeemRequest && (
            <div className="mt-8">
              <h6 className="mt-2 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('redeem_request_details')}
              </h6>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('request') + ' ID'}
                  </p>
                  <p className="font-medium">{redeemRequest.CallingAgentRedeemRequestID}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('request_status')}
                  </p>
                  <p className="font-medium">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        redeemRequest.Status === 'settled'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : redeemRequest.Status === 'approved'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : redeemRequest.Status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                      {t(redeemRequest.Status)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('requested_amount')}
                  </p>
                  <p className="font-medium text-blue-600 dark:text-blue-400">
                    {redeemRequest.RequestedAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('requested_at')}
                  </p>
                  <p className="font-medium">{getDateInUTCToTimeZone(redeemRequest.RequestedAt)}</p>
                </div>
                {redeemRequest.ApprovedAmount && (
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('approved_amount')}
                    </p>
                    <p className="font-medium text-green-600 dark:text-green-400">
                      {redeemRequest.ApprovedAmount}
                    </p>
                  </div>
                )}
                {redeemRequest.ApprovedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('approved_at')}
                    </p>
                    <p className="font-medium">
                      {getDateInUTCToTimeZone(redeemRequest.ApprovedAt)}
                    </p>
                  </div>
                )}
                {redeemRequest.SettledAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('settled_at')}
                    </p>
                    <p className="font-medium">{getDateInUTCToTimeZone(redeemRequest.SettledAt)}</p>
                  </div>
                )}
                <div className="col-span-full">
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('remarks')}
                  </p>
                  <p className="font-medium">{redeemRequest.Remarks || 'No remarks'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={onClose}>
              {t('back')}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}

ViewDetailsModal.propTypes = {
  summaryData: PropTypes.object,
  onClose: PropTypes.func.isRequired
};
