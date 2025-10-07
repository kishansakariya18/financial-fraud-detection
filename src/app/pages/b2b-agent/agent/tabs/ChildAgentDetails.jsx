import { useTranslation } from 'react-i18next';
import { AgentView } from 'components/sections/b2b-agents';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';

const ChildAgentDetails = () => {
  const { t } = useTranslation();
  const breadcrumbItem = [
    { title: t('agents'), path: '/agents' },
    { title: t('child') + ' ' + t('agent') }
  ];

  const handleFetchAgentDetails = async (agentUID) => {
    return await B2BAgentService.getChildAgentDetails(agentUID);
  };

  return (
    <AgentView
      onFetchAgentDetails={handleFetchAgentDetails}
      breadcrumbItem={breadcrumbItem}
      pageTitle={t('Agent')}
      showAgentType={false}
    />
  );
};

export default ChildAgentDetails;
