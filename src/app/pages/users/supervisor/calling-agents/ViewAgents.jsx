// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from 'react';

// Local Imports
// import { useKYCFormContext } from "../KYCFormContext";
// import { declarationSchema } from "../schema";
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import AgentService from 'services/agent.services';
import DetailsPageLayout from 'components/sections/admins/DetailsPageLayout';
import AdminDetailsCard from 'components/sections/admins/AdminDetailsCard';

const ViewAgents = () => {
  const { t } = useTranslation();
  const { callingAgentUID, supervisorUID } = useParams();
  const pageTitle = t('calling_agent') + ' ' + t('details');

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const fetchAgentDetails = async () => {
    setLoading(true);
    const result = await AgentService.getAgentDetail(callingAgentUID);

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
  }, [callingAgentUID]);

  const breadcrumbItems = [
    { title: t('calling_agents'), path: `/users/supervisor/${supervisorUID}/tab/calling-agents` },
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

export default ViewAgents;
