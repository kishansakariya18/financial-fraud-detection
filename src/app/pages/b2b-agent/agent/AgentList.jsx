import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AgentList } from 'components/sections/b2b-agents';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';
import { useSelector } from 'react-redux';
import { AGENT_TIER_TYPE } from 'constants/app.constant';

const ChildAgentList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const handleFetchAgents = async (data) => {
    return await B2BAgentService.getAllChildAgent(data);
  };

  const handleChangeAgentStatus = async (agentUID) => {
    return await B2BAgentService.changeChildAgentStatus(agentUID);
  };

  const handleViewAgent = (agentUID) => {
    navigate(`/agents/${agentUID}/tab/details`);
  };

  const handleEditAgent = (agentUID) => {
    navigate(`/agents/${agentUID}/edit`);
  };

  const handleAddAgent = () => {
    navigate('/agents/add');
  };

  return (
    <AgentList
      onFetchAgents={handleFetchAgents}
      onChangeAgentStatus={handleChangeAgentStatus}
      onViewAgent={handleViewAgent}
      onEditAgent={handleEditAgent}
      onAddAgent={userData?.agentType === AGENT_TIER_TYPE.TIER_3 ? null : handleAddAgent}
      pageTitle={t('agents') || 'Agents'}
      showAgentTypeFilter={false}
      showStatusFilter={true}
    />
  );
};

export default ChildAgentList;
