import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import AgentForm from '../../../../components/sections/b2b-agents/add-edit-form/AgentForm';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';

const EditAgent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFetchAgentDetails = async (agentUID) => {
    return await B2BAgentService.getAgentDetails(agentUID);
  };

  const handleEditAgent = async (agentUID, agentData) => {
    return await B2BAgentService.editAgent(agentUID, agentData);
  };

  const breadcrumbItem = [
    { title: t('b2b_agents') || 'Agents', path: '/agent/list' },
    { title: t('edit') || 'Edit' }
  ];
  const handleNavigateBack = () => {
    navigate('/agent/list');
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

export default EditAgent;
