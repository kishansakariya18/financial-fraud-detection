import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import AgentLoginHistory from 'components/sections/b2b-agents/view/agent-login-history/LoginHistory';

const ChildAgentLoginHistory = () => {
  const { t } = useTranslation();
  const { agentUID } = useParams();

  const breadcrumbItem = [
    { title: t('agents'), path: '/agents' },
    { title: t('login') + ' ' + t('history') || 'Login History' }
  ];

  return <AgentLoginHistory agentUID={agentUID} breadcrumbItem={breadcrumbItem} />;
};

export default ChildAgentLoginHistory;
