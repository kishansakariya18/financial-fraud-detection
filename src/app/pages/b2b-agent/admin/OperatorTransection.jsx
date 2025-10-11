import { useTranslation } from 'react-i18next';
import { Page } from 'components/shared/Page';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useCurrencyContext } from 'app/contexts/currency/context';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { useCallback, useEffect, useState } from 'react';
import AgentTransactionList from 'components/sections/b2b-agents/view/agent-transaction/AgentTransactionList';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { OperatorWalletManageDialog } from 'components/sections/b2b-agents/view/OperatorWalletManageDialog';
import { Button } from 'components/ui';

export default function OperatorTransection() {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrencyContext();
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const { hasPermission } = usePermissions();
  const isWalletView = hasPermission(PERMISSIONS.OPERATOR.WALLET_VIEW);
  const isManageFunds = hasPermission(PERMISSIONS.OPERATOR.MENAGE_FUNDS);
  const isViewTransaction = hasPermission(PERMISSIONS.OPERATOR.WALLET_TRANSACTION_LIST);

  const fetchWalletData = useCallback(() => {
    setIsLoading(true);
    B2BAgentWalletService.getOperatorWallet()
      .then(({ response }) => {
        setWalletBalance(response.data?.Balance || 0);
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

  const handleManageSuccess = () => {
    fetchWalletData();
  };

  return (
    <Page title={t('transection')}>
      <div className="space-y-6 px-[--margin-x] pb-4 pt-4">
        {/* Wallet Balance Section */}
        {isWalletView && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium uppercase tracking-wider text-blue-100">
                  {t('operator_balance')}
                </h3>
                <p className="mt-2 text-3xl font-bold text-white">
                  {formatCurrency(walletBalance || 0)}
                </p>
              </div>

              {/* Manage Funds Button */}
              <div className="flex flex-col items-end gap-2">
                {isManageFunds ? (
                  <Button
                    onClick={() => setIsManageDialogOpen(true)}
                    className="border border-white/30 bg-white/20 text-white shadow-lg transition-all duration-200 hover:bg-white/20 focus:bg-white/20">
                    {t('manage_funds')}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
      {isViewTransaction ? (
        <AgentTransactionList onFetchTransactions={fetchOperatorTransactions} />
      ) : null}
      <OperatorWalletManageDialog
        isOpen={isManageDialogOpen}
        onClose={() => setIsManageDialogOpen(false)}
        onSuccess={handleManageSuccess}
      />
    </Page>
  );
}
