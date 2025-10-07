import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import AgentForm from '../../../../components/sections/b2b-agents/add-edit-form/AgentForm';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';

const AddAgent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('b2b_agents') || 'Agents', path: '/agent/list' },
    { title: t('add') || 'Add' }
  ];

  const handleCreateAgent = async (agentData) => {
    return await B2BAgentService.createAgent(agentData);
  };

  const handleNavigateBack = () => {
    navigate('/agent/list');
  };

  return (
    <AgentForm
      mode="add"
      onCreateAgent={handleCreateAgent}
      onNavigateBack={handleNavigateBack}
      breadcrumbItem={breadcrumbItem}
      pageTitle={t('agent') || 'Agent'}
    />
  );
};

export default AddAgent;
