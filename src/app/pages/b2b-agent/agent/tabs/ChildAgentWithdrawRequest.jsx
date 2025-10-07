import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Page } from 'components/shared/Page';
import { WithdrawRequestList } from 'components/sections/withdraw-requests';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';

const ChildAgentWallet = () => {
  const { t } = useTranslation();
  const { agentUID } = useParams();
  const pageTitle = t('withdraw_requests');

  const fetchWithdrawRequests = async (requestObject) => {
    return await B2BAgentWalletService.withdrawRequestList({
      ...requestObject,
      ...(agentUID && { formAgentUID: agentUID })
    });
  };

  const breadcrumbs = [{ title: t('agents'), path: '/agents' }, { title: t('withdraw_requests') }];

  return (
    <Page title={pageTitle}>
      <WithdrawRequestList
        pageTitle={pageTitle}
        // listFor={isAgent ? 'agent' : 'admin'}
        getWithdrawRequestList={fetchWithdrawRequests}
        breadcrumbs={breadcrumbs}
        showActions={false}
      />
    </Page>
  );
};

export default ChildAgentWallet;
