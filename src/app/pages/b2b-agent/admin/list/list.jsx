import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AgentList } from 'components/sections/b2b-agents';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';

export default function B2BAgent() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleFetchAgents = async (data) => {
    return await B2BAgentService.getAllAgent(data);
  };

  const handleChangeAgentStatus = async (agentUID) => {
    return await B2BAgentService.changeAgentStatus(agentUID);
  };

  const handleViewAgent = (agentUID) => {
    navigate(`/agent/${agentUID}/tab/details`);
  };

  const handleEditAgent = (agentUID) => {
    navigate(`/agent/${agentUID}/edit`);
  };

  const handleAddAgent = () => {
    navigate('/agent/add');
  };

  return (
    <AgentList
      onFetchAgents={handleFetchAgents}
      onChangeAgentStatus={handleChangeAgentStatus}
      onViewAgent={handleViewAgent}
      onEditAgent={handleEditAgent}
      onAddAgent={handleAddAgent}
      pageTitle={t('b2b_agents') || 'B2B Agents'}
      showAddButton={true}
      showAgentTypeFilter={true}
      showDateFilter={true}
      showStatusFilter={true}
    />
  );
}
