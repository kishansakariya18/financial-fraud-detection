// Import Dependencies
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// Local Imports
import { Button } from 'components/ui';

export function ViewDetails({ wallet, onClose }) {
  const { t } = useTranslation();

  const walletDetails = [
    {
      label: t('wallet_id'),
      value: wallet.id
    },
    {
      label: t('currency_code'),
      value: wallet.currencyCode
    },
    {
      label: t('currency_name'),
      value: wallet.currencyName
    },
    {
      label: t('real_cash_amount'),
      value: '11'
    },
    {
      label: t('bonus_amount'),
      value: '11'
    },
    {
      label: t('total_amount'),
      value: '11'
    },
    {
      label: t('status'),
      value: wallet.status,
      isStatus: true
    },
    {
      label: t('created_at'),
      value: '-'
    },
    {
      label: t('updated_at'),
      value: '-'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      frozen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[status] || statusConfig.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {walletDetails.map((detail, index) => (
          <div key={index} className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{detail.label}</dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">
              {detail.isStatus ? getStatusBadge(detail.value) : detail.value}
            </dd>
          </div>
        ))}
      </div>

      {/* Wallet Balance Summary */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
          {t('balance_summary')}
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{'-'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('real_cash')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">{'-'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('bonus')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">{'-'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('total')}</div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section - Placeholder */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
          {t('recent_activity')}
        </h4>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('no_recent_activity')}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onClose}>
          {t('close')}
        </Button>
      </div>
    </div>
  );
}

ViewDetails.propTypes = {
  wallet: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};
