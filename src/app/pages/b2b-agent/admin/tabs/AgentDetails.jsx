import { useTranslation } from 'react-i18next';
import { AgentView } from 'components/sections/b2b-agents';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';

const AgentDetails = () => {
  const { t } = useTranslation();
  const breadcrumbItem = [
    { title: t('b2b_agents') || 'Agents', path: '/agent/list' },
    { title: t('view') || 'View' }
  ];

  const handleFetchAgentDetails = async (agentUID) => {
    return await B2BAgentService.getAgentDetails(agentUID);
  };

  return (
    <AgentView
      onFetchAgentDetails={handleFetchAgentDetails}
      breadcrumbItem={breadcrumbItem}
      pageTitle={t('agent') || 'Agent'}
      showAgentType={true}
    />
  );
};

export default AgentDetails;
