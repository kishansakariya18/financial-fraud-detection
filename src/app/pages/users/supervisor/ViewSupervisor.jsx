import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import AdminService from 'services/admin.services';
import DetailsPageLayout from 'components/sections/admins/DetailsPageLayout';
import AdminDetailsCard from 'components/sections/admins/AdminDetailsCard';

const ViewDetails = () => {
  const { t } = useTranslation();
  const { supervisorUID } = useParams();
  const pageTitle = t('supervisor') + ' ' + t('details');

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const fetchSupervisorDetails = async () => {
    setLoading(true);
    const result = await AdminService.getAdminDetail(supervisorUID);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSupervisorDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supervisorUID]);

  const breadcrumbItems = [
    { title: t('supervisors'), path: '/users/supervisor' },
    { title: t('details') }
  ];

  return (
    <DetailsPageLayout pageTitle={pageTitle} breadcrumbItems={breadcrumbItems}>
      <AdminDetailsCard
        data={response}
        loading={loading}
        error={error}
        titleKey="supervisor_information"
        uidKey="supervisorUid"
        showSuperAdmin={false}
        showRole={false}
      />
    </DetailsPageLayout>
  );
};

export default ViewDetails;
