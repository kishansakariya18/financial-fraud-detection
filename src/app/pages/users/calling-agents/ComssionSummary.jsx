import CommissionSummaryList from 'components/sections/commission-summary/list';
import { Page } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

const CommissionSummary = () => {
  const { t } = useTranslation();
  const { agentUID } = useParams();

  const breadcrumbs = [
    { title: t('calling_agents'), path: '/calling-agents/list' },
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
};

export default CommissionSummary;
