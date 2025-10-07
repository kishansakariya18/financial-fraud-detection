import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AgentForm } from 'components/sections/b2b-agents';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';

const AddChildAgent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCreateAgent = async (agentData) => {
    return await B2BAgentService.createChildAgent(agentData);
  };

  const handleNavigateBack = () => {
    navigate('/agents');
  };

  const breadcrumbItem = [
    { title: t('agents') || 'Agents', path: '/agents' },
    { title: t('add') || 'Add' }
  ];

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

export default AddChildAgent;
