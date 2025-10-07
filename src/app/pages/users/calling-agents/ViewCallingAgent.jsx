import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import AgentService from 'services/agent.services';
import DetailsPageLayout from 'components/sections/admins/DetailsPageLayout';
import AdminDetailsCard from 'components/sections/admins/AdminDetailsCard';

const ViewCallingAgentDetails = () => {
  const { t } = useTranslation();
  const { agentUID } = useParams();
  const pageTitle = t('calling_agent') + ' ' + t('details');

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const fetchAgentDetails = async () => {
    setLoading(true);
    const result = await AgentService.getAgentDetail(agentUID);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentUID]);

  const breadcrumbItems = [
    { title: t('calling_agents'), path: '/calling-agents/list' },
    { title: t('details') }
  ];

  return (
    <DetailsPageLayout pageTitle={pageTitle} breadcrumbItems={breadcrumbItems}>
      <AdminDetailsCard
        data={response}
        loading={loading}
        error={error}
        titleKey="calling_agent_information"
        uidKey="agentUid"
        showSuperAdmin={false}
        showRole={false}
      />
    </DetailsPageLayout>
  );
};

export default ViewCallingAgentDetails;
