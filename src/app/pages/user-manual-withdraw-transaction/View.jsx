import { Page } from 'components/shared/Page';
import { useLocation, useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Button } from 'components/ui';
import UserManualDepositTransactionService from 'services/user-manual-deposit-transaction.services';
import { responseMapper } from './helper';

export default function ViewWithdraw() {
  const { id } = useParams();
  const { t } = useTranslation();
  const location = useLocation();
  const [txn, setTxn] = useState(null);

  const breadcrumbItem = [
    { title: t('user_manual_withdraw_transaction'), path: '/user-manual-withdraw-transaction' },
    { title: t('view') }
  ];

  useEffect(() => {
    const stateRow = location.state?.row;
    if (stateRow) {
      setTxn(stateRow);
      return;
    }
    async function fetchTxn() {
      const result = await UserManualDepositTransactionService.getUserManualWithdrawTransactionList(
        {
          pagination: { pageIndex: 0, pageSize: 50 },
          keyword: id
        }
      );
      if (result.status === 200) {
        const list = result.response?.data || [];
        const mapped = responseMapper(list);
        const item = mapped.find((x) => `${x.id}` === `${id}`);
        setTxn(item || null);
      }
    }
    fetchTxn();
  }, [id, location.state]);

  const maskedWallet = useMemo(() => {
    const val = txn?.walletAddress || txn?.WalletAddress;
    if (!val || typeof val !== 'string') return '';
    if (val.length <= 10) return val;
    return `${val.slice(0, 6)}****${val.slice(-4)}`;
  }, [txn]);

  const cardLast4 = useMemo(
    () => txn?.cardLast4 || txn?.CardLast4 || txn?.card?.last4 || '',
    [txn]
  );
  const cardExpiry = useMemo(() => {
    const mm = txn?.cardExpiryMonth || txn?.CardExpiryMonth || txn?.card?.expMonth;
    const yy = txn?.cardExpiryYear || txn?.CardExpiryYear || txn?.card?.expYear;
    if (!mm || !yy) return '';
    const m = String(mm).padStart(2, '0');
    const y = String(yy).slice(-2);
    return `${m}/${y}`;
  }, [txn]);
  const cardholderName = useMemo(
    () => txn?.cardholderName || txn?.CardholderName || txn?.card?.name || '',
    [txn]
  );

  return (
    <Page title={t('user_manual_withdraw_transaction_detail')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('user_manual_withdraw_transaction_detail')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        {!txn ? (
          <div className="p-4">Loading...</div>
        ) : (
          <div className="space-y-2 p-4">
            <div>
              <strong>{t('user_id')}:</strong> {txn.userID || txn.UserID || '-'}
            </div>
            <div>
              <strong>{t('bank_transaction_id')}:</strong>{' '}
              {txn.bankTransactionID || txn.BankTransactionID || '-'}
            </div>
            <div>
              <strong>{t('withdraw_time') || 'Withdraw Time'}:</strong>{' '}
              {txn.withdrawTime || txn.depositTime || txn.DepositTime || '-'}
            </div>
            <div>
              <strong>{t('amount')}:</strong> {txn.amount ?? txn.Amount ?? '-'}
            </div>
            {Number(txn?.CurrencyType ?? txn?.currencyType) === 1 ? (
              <div className="mt-2 space-y-2">
                <div>
                  <strong>{t('network') || 'Network'}:</strong>{' '}
                  {txn.network || txn.CryptoNetwork || txn.cryptoNetwork || '-'}
                </div>
                <div>
                  <strong>{t('wallet_address') || 'Wallet Address'}:</strong> {maskedWallet || '-'}
                </div>
                <div>
                  <strong>{t('txid') || 'TxID'}:</strong> {txn.txid || txn.TxId || txn.TxID || '-'}
                </div>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <div>
                  <strong>{t('card_last4') || 'Card Last4'}:</strong> {cardLast4 || '-'}
                </div>
                <div>
                  <strong>{t('expiry') || 'Expiry'}:</strong> {cardExpiry || '-'}
                </div>
                <div>
                  <strong>{t('cardholder_name') || 'Cardholder Name'}:</strong>{' '}
                  {cardholderName || '-'}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button onClick={() => window.history.back()}>{t('back')}</Button>
        </div>
      </div>
    </Page>
  );
}
