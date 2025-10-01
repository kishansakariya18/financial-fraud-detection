import { useTranslation } from 'react-i18next';
import { WithdrawRequestList } from 'components/sections/withdraw-requests';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
export default function AgentWithdrawRequest() {
  const { t } = useTranslation();

  const pageTitle = t('agent') + ' ' + t('withdraw_requests');

  const fetchWithdrawRequests = async (requestObject) => {
    return await B2BAgentWalletService.withdrawRequestList({
      ...requestObject,
      filters: {
        ...requestObject.filters,
        entityType: 'b2b_agent'
      }
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
      />
    </>
  );
}
