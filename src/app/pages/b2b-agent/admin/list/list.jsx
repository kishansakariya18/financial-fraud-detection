import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AgentList } from 'components/sections/b2b-agents';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { useMemo } from 'react';

export default function B2BAgent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const accessPermission = useMemo(() => {
    return {
      isEdit: hasPermission(PERMISSIONS.AGENTS.EDIT),
      isAdd: hasPermission(PERMISSIONS.AGENTS.ADD),
      changeStatus: hasPermission(PERMISSIONS.AGENTS.CHANGE_STATUS)
    };
  }, [hasPermission]);

  const handleFetchAgents = (data) => {
    return B2BAgentService.getAllAgent(data);
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
      onEditAgent={accessPermission.isEdit ? handleEditAgent : null}
      onAddAgent={handleAddAgent}
      pageTitle={t('b2b_agents') || 'B2B Agents'}
      showAddButton={accessPermission.isAdd}
      showAgentTypeFilter={true}
      showDateFilter={true}
      showStatusFilter={accessPermission.changeStatus}
    />
  );
}
