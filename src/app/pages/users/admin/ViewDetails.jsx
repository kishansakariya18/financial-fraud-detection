// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from 'react';

// Local Imports
import { Card, GhostSpinner } from 'components/ui';
// import { useKYCFormContext } from "../KYCFormContext";
// import { declarationSchema } from "../schema";
import AdminService from 'services/admin.services';
import { useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { parseAdminStatusToApp } from './helper';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { useTranslation } from 'react-i18next';

const ViewDetails = () => {
  //   const kycFormCtx = useKYCFormContext();
  const { t } = useTranslation();
  const pageTitle = t('admin') + ' ' + t('details');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const { adminId } = useParams();

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

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          {pageTitle}
        </h2>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <Card className="h-full p-4 sm:p-5">
            <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">{t('details')}</h5>
            <p className="text-sm text-gray-500 dark:text-dark-200">
              {t('details') + ' ' + t('regarding') + ' ' + t('admin')}
            </p>

            <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
              {t('information')}:
            </h6>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('userName')}:
                </p>
                <p>{response?.Username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('firstName')}:
                </p>
                <p>{response?.FirstName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('lastName')}:
                </p>
                <p>{response?.LastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('email')}:
                </p>
                <p>{response?.Email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('mobile')}:
                </p>
                <p>
                  {response?.dialCode || '+91'} {response?.Mobile}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('status')}:
                </p>
                <p>{+response.Status >= 0 && parseAdminStatusToApp(+response?.Status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('createdAt')}:
                </p>
                <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('role')}:</p>
                <p>{response?.Role}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
              {loading && <GhostSpinner className="size-4 border-2" />}
              {error && <p>{error}</p>}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default ViewDetails;
