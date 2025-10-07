import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Page } from 'components/shared/Page';
import CommissionSummaryList from 'components/sections/commission-summary/list';

export default function AgentSummary() {
  const { t } = useTranslation();
  const userData = useSelector((state) => state.auth.userData);

  // Use the agent's own UID for fetching summary
  const agentUID = userData?.AdminUID;

  const breadcrumbs = [
    { title: t('calling_agents'), path: '/agent' },
    { title: t('commission_summary') }
  ];

  return (
    <Page title={t('nav.calling_agent.summary')}>
      <CommissionSummaryList
        agentUID={agentUID}
        breadcrumbs={breadcrumbs}
        pageTitle={t('commission_summary')}
      />
    </Page>
  );
}
