import { useTranslation } from 'react-i18next';
import { Page } from 'components/shared/Page';
import { WithdrawRequestList } from 'components/sections/withdraw-requests';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
export default function PlayerWithdrawRequest() {
  const { t } = useTranslation();

  const pageTitle = t('player') + ' ' + t('withdraw_requests');

  const fetchWithdrawRequests = async (requestObject) => {
    return await B2BAgentWalletService.withdrawRequestList({
      ...requestObject,
      filters: {
        ...requestObject.filters,
        entityType: 'player'
      }
    });
  };

  // const breadcrumbs = agentUID
  //   ? [
  //       { title: t('agents'), path: '/agents' },
  //       { title: t('agent') + ' ' + t('details'), path: `/agents/${agentUID}/tab/details` },
  //       { title: t('withdraw_requests') }
  //     ]
  //   : [{ title: t('agents'), path: '/agents' }, { title: t('withdraw_requests') }];

  return (
    <>
      <Page title={pageTitle}>
        <WithdrawRequestList
          listFor="player"
          pageTitle={pageTitle}
          getWithdrawRequestList={fetchWithdrawRequests}
          breadcrumbs={null}
          // showActions={!isAgent} // Only show actions for admin, not for agents
        />
      </Page>
    </>
  );
}
