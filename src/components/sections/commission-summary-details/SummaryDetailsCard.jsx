import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export function SummaryDetailsCard({ summaryData }) {
  const { t } = useTranslation();

  if (!summaryData) return null;

  return (
    <div className="rounded-lg bg-white p-6 dark:bg-dark-800">
      <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-dark-100">
        {t('commission_summary') + ' ' + t('details')}
      </h2>

      {/* Summary Information Grid */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailItem label={t('summary') + ' ID'} value={summaryData.id} />
        <DetailItem label={t('target_name')} value={summaryData.targetName} />
        <DetailItem label={t('event_name')} value={summaryData.eventName} />
        <DetailItem
          label={t('period_start')}
          value={getDateInUTCToTimeZone(summaryData.periodStart)}
        />
        <DetailItem label={t('period_end')} value={getDateInUTCToTimeZone(summaryData.periodEnd)} />
        <DetailItem label={t('total_event_amount')} value={summaryData.totalEventAmount || '0'} />
        <DetailItem
          label={t('commission') + ' Amount'}
          value={summaryData.commissionAmount || '0'}
          valueClassName="font-semibold text-green-600 dark:text-green-400"
        />
        <DetailItem
          label={t('calculated_at')}
          value={getDateInUTCToTimeZone(summaryData.calculatedAt)}
        />
        {summaryData.isRedeemed && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-dark-300">
              {t('redeem_status')}
            </p>
            <div className="mt-1">
              <StatusBadge status={summaryData.isRedeemed} />
            </div>
          </div>
        )}
      </div>

      {/* Redeem Request Details */}
      {summaryData.redeemRequestDetails && (
        <div className="mt-8">
          <h6 className="mb-4 border-b border-gray-200 pb-3 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('redeem_request_details')}
          </h6>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label={t('request') + ' ID'}
              value={summaryData.redeemRequestDetails.CallingAgentRedeemRequestID}
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-dark-300">
                {t('request_status')}
              </p>
              <div className="mt-1">
                <RequestStatusBadge status={summaryData.redeemRequestDetails.Status} />
              </div>
            </div>

            <DetailItem
              label={t('requested_amount')}
              value={summaryData.redeemRequestDetails.RequestedAmount}
              valueClassName="font-semibold"
            />

            <DetailItem
              label={t('requested_at')}
              value={getDateInUTCToTimeZone(summaryData.redeemRequestDetails.RequestedAt)}
            />

            {summaryData.redeemRequestDetails.ApprovedAmount && (
              <DetailItem
                label={t('approved_amount')}
                value={summaryData.redeemRequestDetails.ApprovedAmount}
                valueClassName="font-semibold text-green-600 dark:text-green-400"
              />
            )}

            {summaryData.redeemRequestDetails.ApprovedAt && (
              <DetailItem
                label={t('approved_at')}
                value={getDateInUTCToTimeZone(summaryData.redeemRequestDetails.ApprovedAt)}
              />
            )}

            {summaryData.redeemRequestDetails.SettledAt && (
              <DetailItem
                label={t('settled_at')}
                value={getDateInUTCToTimeZone(summaryData.redeemRequestDetails.SettledAt)}
              />
            )}

            <DetailItem
              label={t('remarks')}
              value={summaryData.redeemRequestDetails.Remarks || 'No remarks'}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({
  label,
  value,
  valueClassName = 'font-medium text-gray-900 dark:text-dark-100'
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-dark-300">
        {label}
      </p>
      <p className={`mt-1 text-sm ${valueClassName}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const { t } = useTranslation();

  const getStatusConfig = (status) => {
    switch (status) {
      case 'done':
        return {
          text: t('redeemed'),
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
      case 'pending':
        return {
          text: t('pending'),
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };
      default:
        return {
          text: t('not_redeemed'),
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
      {config.text}
    </span>
  );
}

SummaryDetailsCard.propTypes = {
  summaryData: PropTypes.object.isRequired
};

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueClassName: PropTypes.string
};

function RequestStatusBadge({ status }) {
  const { t } = useTranslation();

  const getStatusConfig = (status) => {
    switch (status) {
      case 'settled':
        return {
          text: t(status),
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
      case 'approved':
        return {
          text: t(status),
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        };
      case 'rejected':
        return {
          text: t(status),
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
      default:
        return {
          text: t(status),
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
      {config.text}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

RequestStatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};
