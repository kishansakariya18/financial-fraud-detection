import { useMemo } from 'react';
import { Card } from 'components/ui';
import { useTranslation } from 'react-i18next';
import { parsePayoutStatusToApp } from './helper';

export default function ViewModal({ row }) {
  console.log('Row Data in ViewModal:', row);

  const { t } = useTranslation();
  const maskedWallet = useMemo(() => {
    const val = row?.walletAddress || row?.WalletAddress;
    if (!val || typeof val !== 'string') return '';
    if (val.length <= 10) return val;
    return `${val.slice(0, 6)}****${val.slice(-4)}`;
  }, [row]);

  const cardLast4 = useMemo(() => row?.cardNumber || '-', [row]);
  const cardExpiry = useMemo(() => {
    return row?.cardExpitry;
  }, [row]);
  const cardholderName = useMemo(() => row?.cardholderName || row?.CardholderName || '', [row]);

  return (
    <div className="col-span-12 sm:col-span-8 lg:col-span-9">
      <Card className="h-full p-4 sm:p-5">
        <h6 className="mt-2 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
          {t('transaction_information')}:
        </h6>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('user_id')}:</p>
            <p>{row?.userID || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('transactionId')}:
            </p>
            <p>{row?.id || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('total') + ' ' + t('amount')}:
            </p>
            <p>{row?.amount ?? '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('actualWithdrawAmount')}:
            </p>
            <p>{row?.actualWithdrawAmount ?? '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('comissionAmount')}:
            </p>
            <p>{row?.withdrawCommissionAmount ?? '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('comissionPercentage')}:
            </p>
            <p>{row?.withdrawCommissionPercent + ' %'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('currency')}:</p>
            <p>{row?.currencyCode || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('status')}:</p>
            <p>{parsePayoutStatusToApp(row?.depositStatus) ?? '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('date_created')}:
            </p>
            <p>{row?.dateCreated || '-'}</p>
          </div>
        </div>

        {(row?.CurrencyType ?? row?.currencyType === 'CRYPTO') ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('network')}:
              </p>
              <p>{row?.network || row?.CryptoNetwork || row?.cryptoNetwork || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('wallet_address')}:
              </p>
              <p>{maskedWallet || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('txid')}:</p>
              <p>{row?.txid || row?.TxId || row?.TxID || '-'}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('card_number')}:
              </p>
              <p>{cardLast4 || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('expiry')}:</p>
              <p>{cardExpiry || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('cardholder_name')}:
              </p>
              <p>{cardholderName || '-'}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
