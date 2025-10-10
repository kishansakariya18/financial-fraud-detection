import { Page } from 'components/shared/Page';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Button } from 'components/ui';
import UserManualDepositTransactionService from 'services/user-manual-deposit-transaction.services';

export default function ViewWithdraw() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [txn, setTxn] = useState(null);

  const breadcrumbItem = [
    { title: t('user_manual_deposit_transaction'), path: '/user-manual-withdraw-transaction' },
    { title: t('view') }
  ];

  useEffect(() => {
    // Reuse deposit service for now until withdraw endpoints are provided
    // Assuming a get by id exists or will be added similarly; placeholder below
    async function fetchTxn() {
      const result = await UserManualDepositTransactionService.getUserManualDepositTransactionList({
        pagination: { pageIndex: 0, pageSize: 1 },
        keyword: id
      });
      if (result.status === 200) {
        const list = result.response?.data || [];
        const item = list.find((x) => `${x.UserBankDepositUID}` === id);
        setTxn(item || null);
      }
    }
    fetchTxn();
  }, [id]);

  return (
    <Page title={t('user_manual_deposit_transaction_detail')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('user_manual_deposit_transaction_detail')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        {!txn ? (
          <div className="p-4">Loading...</div>
        ) : (
          <div className="p-4 space-y-2">
            <div>
              <strong>{t('user_id')}:</strong> {txn.UserID}
            </div>
            <div>
              <strong>{t('bank_transaction_id')}:</strong> {txn.BankTransactionID}
            </div>
            <div>
              <strong>{t('deposit_time')}:</strong> {txn.DepositTime}
            </div>
            <div>
              <strong>{t('amount')}:</strong> {txn.Amount}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button onClick={() => window.history.back()}>{t('back')}</Button>
        </div>
      </div>
    </Page>
  );
}
