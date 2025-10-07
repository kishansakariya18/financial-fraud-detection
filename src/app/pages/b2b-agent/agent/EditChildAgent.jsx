import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AgentForm } from 'components/sections/b2b-agents';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';

const EditChildAgent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('agents') || 'Agents', path: '/agents' },
    { title: t('edit') || 'Edit' }
  ];

  const handleFetchAgentDetails = async (agentUID) => {
    return await B2BAgentService.getChildAgentDetails(agentUID);
  };

  const handleEditAgent = async (agentUID, agentData) => {
    return await B2BAgentService.editChildAgent(agentUID, agentData);
  };

  const handleNavigateBack = () => {
    navigate('/agents');
  };

  return (
    <AgentForm
      mode="edit"
      onFetchAgentDetails={handleFetchAgentDetails}
      onEditAgent={handleEditAgent}
      onNavigateBack={handleNavigateBack}
      breadcrumbItem={breadcrumbItem}
      pageTitle={t('agent') || 'Agent'}
    />
  );
};

export default EditChildAgent;
