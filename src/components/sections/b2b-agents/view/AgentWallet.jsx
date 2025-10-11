// Import Dependencies
import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { WalletIcon, ArrowPathIcon, BanknotesIcon } from '@heroicons/react/24/outline';

// Local Imports
import { Button } from 'components/ui';
import { CustomModal } from 'components/custom/CustomModal';
import { CreditDebitForm } from './CreditDebitForm';
import { ManualAdjustmentForm } from './ManualAdjustmentForm';
import WithdrawRequestDialog from './WithdrawRequestDialog';
import b2bAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { toast } from 'sonner';
import AgentTransactionList from './agent-transaction/AgentTransactionList';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useSelector } from 'react-redux';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';
import { AGENT_TIER_TYPE, ADMIN_TYPE } from 'constants/app.constant';
import { useCurrencyContext } from 'app/contexts/currency/context';
import { DashboardCard } from 'components/custom/DashboardCard';

export default function AgentWallet({
  agentUID,
  breadcrumbs,
  manageCommissionFunds = true,
  manageLineupFunds = true
}) {
  const { t } = useTranslation();
  const { userData } = useSelector((state) => state.auth);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawRequestModal, setShowWithdrawRequestModal] = useState(false);
  const [showAdjustBalanceModal, setShowAdjustBalanceModal] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [walletAgent, setWalletAgent] = useState(null);
  const { formatCurrency } = useCurrencyContext();

  const isOwnWallet = useMemo(
    () => userData?.AgentID && userData?.AgentID === walletData?.AgentID,
    [userData?.AgentID, walletData?.AgentID]
  );

  const isOwanChildAgent = useMemo(
    () =>
      userData?.AgentID
        ? walletAgent?.ParentAgentID === userData?.AgentID
        : walletAgent?.AgentType === AGENT_TIER_TYPE.TIER_1,
    [userData?.AgentID, walletAgent?.AgentType, walletAgent?.ParentAgentID]
  );

  const isAdmin = useMemo(() => userData?.AdminType === ADMIN_TYPE.ADMIN, [userData?.AdminType]);

  const onFetchWalletAgentDetails = async (agentUID) => {
    return await B2BAgentService.getChildAgentDetails(agentUID)
      .then(({ response }) => {
        setWalletAgent(response.data);
      })
      .catch((err) => {
        console.error('Error fetching agent wallet:', err);
      });
  };

  // Fetch wallet data
  const fetchWalletData = async () => {
    setLoading(true);
    b2bAgentWalletService
      .getAgentWallet({ agentUID })
      .then(({ response }) => {
        setWalletData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching wallet data:', error);
        toast.error(error || 'Failed to load wallet data');
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (agentUID) {
      fetchWalletData();
      onFetchWalletAgentDetails(agentUID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentUID]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };
  const handleWithdrawRequestSuccess = () => {
    setShowWithdrawRequestModal(false);
    fetchWalletData();
  };

  const haddleCloseAdjustBalanceModal = (response) => {
    setShowAdjustBalanceModal(null);
    if (response?.isRefresh) {
      fetchWalletData();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">{t('loading_wallet_data')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 px-[--margin-x] pb-2">
        {/* Header with Actions */}
        <div className="flex items-center justify-between pt-4">
          {breadcrumbs ? (
            <div className={'flex items-center gap-4 pr-[--margin-x]'}>
              <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
                {t('agent_wallet')}
              </h2>
              <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
                <div className="hidden self-stretch py-1 sm:flex">
                  <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
                </div>
                <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-1">
              <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{t('refresh')}</span>
            </Button>
            {isAdmin && manageCommissionFunds && (
              <Button
                size="sm"
                color="warning"
                onClick={() => setShowAdjustBalanceModal('commission')}
                className="flex items-center space-x-1">
                <BanknotesIcon className="h-4 w-4" />
                <span>{t('adjust_commission_balance')}</span>
              </Button>
            )}

            {isOwanChildAgent && (
              <Button
                size="sm"
                color="info"
                onClick={() => setShowAdjustBalanceModal('lineup')}
                className="flex items-center space-x-1">
                <WalletIcon className="h-4 w-4" />
                <span>{t('adjust_lineup_balance')}</span>
              </Button>
            )}

            {isOwnWallet && manageLineupFunds && (
              <Button
                size="sm"
                color="warning"
                onClick={() => setShowWithdrawRequestModal(true)}
                className="flex items-center space-x-1">
                <BanknotesIcon className="h-4 w-4" />
                <span>{t('withdraw_request')}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Wallet Balance Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <DashboardCard
            label={t('commission_balance')}
            value={formatCurrency(walletData?.Balance || 0)}
            gradientFrom="from-orange-400"
            gradientTo="to-orange-500"
            textColor="text-orange-100"
            maskShape="is-diamond"
          />
          <DashboardCard
            label={t('lineup_balance')}
            value={formatCurrency(walletData?.LineUpBalance || 0)}
            gradientFrom="from-blue-400"
            gradientTo="to-blue-500"
            textColor="text-blue-100"
            maskShape="is-diamond"
          />
        </div>
      </div>
      <AgentTransactionList agentUID={agentUID} />
      {/* Credit/Debit Modal */}
      {/* <CustomModal
        show={!!showCreditDebitModal}
        onClose={() => setShowCreditDebitModal(null)}
        title={t('credit_amount')}>
        <CreditDebitForm
          agentUID={agentUID}
          type={showCreditDebitModal === 'credit' ? 'credit' : 'debit'}
          onSuccess={handleTransactionSuccess}
          onCancel={() => setShowCreditDebitModal(null)}
        />
      </CustomModal> */}

      {/* Withdraw Request Modal */}
      <CustomModal
        show={showWithdrawRequestModal}
        onClose={() => setShowWithdrawRequestModal(false)}
        title={t('withdraw_request')}>
        <WithdrawRequestDialog
          agentUID={agentUID}
          currentBalance={walletData?.Balance || 0}
          onSuccess={handleWithdrawRequestSuccess}
          onCancel={() => setShowWithdrawRequestModal(false)}
        />
      </CustomModal>

      <CreditDebitForm
        agentUID={agentUID}
        isOpen={showAdjustBalanceModal === 'lineup'}
        onCancel={haddleCloseAdjustBalanceModal}
      />
      <ManualAdjustmentForm
        agentUID={agentUID}
        isOpen={showAdjustBalanceModal === 'commission'}
        onClose={haddleCloseAdjustBalanceModal}
      />
    </div>
  );
}

AgentWallet.propTypes = {
  agentUID: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.array
};
