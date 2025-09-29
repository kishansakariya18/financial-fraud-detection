// Import Dependencies
import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  MinusIcon,
  WalletIcon,
  ArrowPathIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

// Local Imports
import { Button } from 'components/ui';
import { CustomModal } from 'components/custom/CustomModal';
import { CreditDebitForm } from './CreditDebitForm';
import WithdrawRequestDialog from './WithdrawRequestDialog';
import b2bAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { toast } from 'sonner';
import AgentTransactionList from './agent-transaction/AgentTransactionList';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useSelector } from 'react-redux';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';
import { AGENT_TIER_TYPE } from 'constants/app.constant';

export default function AgentWallet({ agentUID, breadcrumbs }) {
  const { t } = useTranslation();
  const { userData } = useSelector((state) => state.auth);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreditDebitModal, setShowCreditDebitModal] = useState(null);
  const [showWithdrawRequestModal, setShowWithdrawRequestModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [walletAgent, setWalletAgent] = useState(null);

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

  const handleTransactionSuccess = () => {
    setShowCreditDebitModal(null);
    fetchWalletData();
  };

  const handleWithdrawRequestSuccess = () => {
    setShowWithdrawRequestModal(false);
    fetchWalletData();
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
      <div className="space-y-4 px-[--margin-x] pb-8">
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

          {(isOwanChildAgent || isOwnWallet) && (
            <div className="flex items-center space-x-2">
              {isOwanChildAgent && (
                <>
                  <Button
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center space-x-1">
                    <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{t('refresh')}</span>
                  </Button>
                  <Button
                    size="sm"
                    color="success"
                    onClick={() => setShowCreditDebitModal('credit')}
                    className="flex items-center space-x-1">
                    <PlusIcon className="h-4 w-4" />
                    <span>{t('credit')}</span>
                  </Button>
                  <Button
                    size="sm"
                    color="error"
                    onClick={() => setShowCreditDebitModal('debit')}
                    className="flex items-center space-x-1">
                    <MinusIcon className="h-4 w-4" />
                    <span>{t('debit')}</span>
                  </Button>
                </>
              )}

              {isOwnWallet && (
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
          )}
        </div>

        {/* Wallet Balance Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('current_balance')}</p>
                <p className="mt-2 text-3xl font-bold">{walletData?.Balance || 0}</p>
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
                <p className="mt-2 text-3xl font-bold">{walletData?.LineUpBalance || 0}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/40">
                <WalletIcon className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AgentTransactionList agentUID={agentUID} />
      {/* Credit/Debit Modal */}
      <CustomModal
        show={!!showCreditDebitModal}
        onClose={() => setShowCreditDebitModal(null)}
        title={t('credit_amount')}>
        <CreditDebitForm
          agentUID={agentUID}
          type={showCreditDebitModal === 'credit' ? 'credit' : 'debit'}
          onSuccess={handleTransactionSuccess}
          onCancel={() => setShowCreditDebitModal(null)}
        />
      </CustomModal>

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
    </div>
  );
}

AgentWallet.propTypes = {
  agentUID: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.array
};
