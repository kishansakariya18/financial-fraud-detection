import { useTranslation } from 'react-i18next';
import { Page } from 'components/shared/Page';
import { ArrowPathIcon, WalletIcon } from '@heroicons/react/24/outline';
import { useCurrencyContext } from 'app/contexts/currency/context';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { useCallback, useEffect, useState } from 'react';
import AgentTransactionList from 'components/sections/b2b-agents/view/agent-transaction/AgentTransactionList';

export default function OperatorTransection() {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrencyContext();
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const fetchWalletData = useCallback(() => {
    setIsLoading(true);
    B2BAgentWalletService.getOperatorWallet()
      .then((response) => {
        setWalletData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching wallet data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const fetchOperatorTransactions = useCallback((requestObject) => {
    return B2BAgentWalletService.operatorTransactionList(requestObject);
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">{t('loading_wallet_data')}</p>
      </div>
    );
  }

  return (
    <Page title={t('transection')}>
      <div className="space-y-4 px-[--margin-x] pb-4 pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('commission_balance')}</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatCurrency(walletData?.Balance || 0)}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/40">
                <WalletIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('lineup_balance')}</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatCurrency(walletData?.LineUpBalance || 0)}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/40">
                <WalletIcon className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AgentTransactionList onFetchTransactions={fetchOperatorTransactions} />
    </Page>
  );
}
