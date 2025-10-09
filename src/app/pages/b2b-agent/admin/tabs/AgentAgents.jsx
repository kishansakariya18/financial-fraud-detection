import { useTranslation } from 'react-i18next';
import { AgentList } from 'components/sections/b2b-agents';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';
import { useNavigate, useParams } from 'react-router';
import { useMemo } from 'react';

const AgentAgents = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { agentUID } = useParams();

  const handleFetchAgents = async (data) => {
    return await B2BAgentService.getAllChildAgent({ ...data, agentUID });
  };

  const handleViewAgent = (childAgentUID) => {
    navigate(`/agent/${childAgentUID}/tab/details`);
  };

  // Create breadcrumbs based on whether we have parent agent context
  const breadcrumbs = useMemo(() => {
    return [{ title: t('agents'), path: '/agent/list' }, { title: t('child') + ' ' + t('agents') }];
  }, [t]);

  return (
    <AgentList
      onFetchAgents={handleFetchAgents}
      // onChangeAgentStatus={handleChangeAgentStatus}
      onViewAgent={handleViewAgent}
      pageTitle={t('agents')}
      showAgentTypeFilter={false}
      showStatusFilter={true}
      breadcrumbs={breadcrumbs}
    />
  );
};

export default AgentAgents;
