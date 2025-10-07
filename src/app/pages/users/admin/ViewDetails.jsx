import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import AdminService from 'services/admin.services';
import DetailsPageLayout from 'components/sections/admins/DetailsPageLayout';
import AdminDetailsCard from 'components/sections/admins/AdminDetailsCard';

const ViewDetails = () => {
  const { t } = useTranslation();
  const { adminId } = useParams();
  const pageTitle = t('admin') + ' ' + t('details');

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const fetchAdminDetails = async () => {
    setLoading(true);
    const result = await AdminService.getAdminDetail(adminId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  const breadcrumbItems = [{ title: t('admin'), path: '/users/admin' }, { title: t('details') }];

  return (
    <DetailsPageLayout pageTitle={pageTitle} breadcrumbItems={breadcrumbItems}>
      <AdminDetailsCard
        data={response}
        loading={loading}
        error={error}
        titleKey="admin_information"
        uidKey="adminUid"
        showSuperAdmin={true}
        showRole={true}
      />
    </DetailsPageLayout>
  );
};

export default ViewDetails;
