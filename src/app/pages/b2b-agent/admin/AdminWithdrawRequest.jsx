import { useTranslation } from 'react-i18next';
import { Page } from 'components/shared/Page';
import { WithdrawRequestList } from 'components/sections/withdraw-requests';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
export default function AdminWithdrawRequest() {
  const { t } = useTranslation();

  const pageTitle = t('withdraw_requests');

  const fetchWithdrawRequests = async (requestObject) => {
    return await B2BAgentWalletService.withdrawRequestList({
      ...requestObject,
      filters: {
        ...requestObject.filters
      }
    });
  };

  return (
    <>
      <Page title={pageTitle}>
        <WithdrawRequestList
          listFor="agent"
          pageTitle={pageTitle}
          getWithdrawRequestList={fetchWithdrawRequests}
          breadcrumbs={null}
          // showActions={!isAgent} // Only show actions for admin, not for agents
        />
      </Page>
    </>
  );
}
