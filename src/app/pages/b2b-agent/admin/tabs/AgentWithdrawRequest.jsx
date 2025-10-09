import { useTranslation } from 'react-i18next';
import { WithdrawRequestList } from 'components/sections/withdraw-requests';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { useParams } from 'react-router';
export default function AgentWithdrawRequest() {
  const { t } = useTranslation();
  const { agentUID } = useParams();
  const pageTitle = t('agent') + ' ' + t('withdraw_requests');

  const fetchWithdrawRequests = async (requestObject) => {
    return await B2BAgentWalletService.withdrawRequestList({
      ...requestObject,
      filters: {
        ...requestObject.filters
      },
      toAgentUID: agentUID
    });
  };

  const breadcrumbs = [
    { title: t('agents'), path: '/agent/list' },
    { title: t('withdraw_requests') }
  ];
  return (
    <>
      <WithdrawRequestList
        pageTitle={pageTitle}
        getWithdrawRequestList={fetchWithdrawRequests}
        breadcrumbs={breadcrumbs}
        showActions={false}
        showFormEntityType
      />
    </>
  );
}
