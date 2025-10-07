import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import AgentLoginHistoryTab from 'components/sections/b2b-agents/view/agent-login-history/LoginHistory';

const AgentLoginHistory = () => {
  const { t } = useTranslation();
  const { agentUID } = useParams();
  const breadcrumbItem = [
    { title: t('agents') || 'Agents', path: '/agent/list' },
    { title: t('login') + ' ' + t('history') || 'Login History' }
  ];

  return <AgentLoginHistoryTab agentUID={agentUID} breadcrumbItem={breadcrumbItem} />;
};

export default AgentLoginHistory;
