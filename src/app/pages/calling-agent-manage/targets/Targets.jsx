import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Page } from 'components/shared/Page';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { useAgentTargets } from '../../users/calling-agents/target-management/hooks/useAgentTargets';
import TargetsList from './components/TargetsList';

export default function AgentTargets() {
  const { t } = useTranslation();
  const userData = useSelector((state) => state.auth.userData);

  // Use the agent's own UID for fetching targets
  const agentUID = userData?.AdminUID;

  const { loading, targets } = useAgentTargets(agentUID, t);

  return (
    <Page title={t('nav.calling_agent.targets')}>
      <ContentWrapper pageTitle={t('nav.calling_agent.targets')}>
        <div className="space-y-6">
          <div className="rounded-lg p-6 dark:bg-dark-800">
            <TargetsList t={t} targets={targets} loading={loading} />
          </div>
        </div>
      </ContentWrapper>
    </Page>
  );
}
