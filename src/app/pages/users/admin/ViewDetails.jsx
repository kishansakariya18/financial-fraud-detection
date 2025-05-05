// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from 'react';

// Local Imports
import { Button, Card, GhostSpinner } from 'components/ui';
// import { useKYCFormContext } from "../KYCFormContext";
// import { declarationSchema } from "../schema";
import AdminService from 'services/admin.services';
import { useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { parseAdminStatusToApp } from './helper';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { useTranslation } from 'react-i18next';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useClipboard } from 'hooks';

const ViewDetails = () => {
  //   const kycFormCtx = useKYCFormContext();
  const { t } = useTranslation();
  const pageTitle = t('admin') + ' ' + t('details');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const { copied, copy } = useClipboard({ timeout: 2000 });

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
            <h6 className="mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
              {t('admin') + ' ' + t('information')}:
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
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('email')}</p>
                <div className="flex space-x-1 rtl:space-x-reverse">
                  <span> {response?.Email || '-'}</span>
                  {response.Email && (
                    <Button
                      data-tooltip
                      data-tooltip-content={copied ? 'Copied' : 'Copy'}
                      onClick={() => copy(response?.Email)}
                      isIcon
                      variant="flat"
                      className="size-5 rounded-full group-hover/td:opacity-100"
                      aria-label="Copy Button">
                      <DocumentDuplicateIcon className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('mobile')}:
                </p>
                <span>
                  {response?.dialCode || '+91'} {response?.Mobile}
                </span>

                {response.Mobile && (
                  <Button
                    data-tooltip
                    data-tooltip-content={copied ? 'Copied' : 'Copy'}
                    onClick={() => copy(response?.Mobile)}
                    isIcon
                    variant="flat"
                    className="size-5 rounded-full group-hover/td:opacity-100"
                    aria-label="Copy Button">
                    <DocumentDuplicateIcon className="size-3.5" />
                  </Button>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('status')}:
                </p>
                <p>
                  {+response.AccountStatus >= 0 &&
                    capitalizeFirstLetter(parseAdminStatusToApp(response.AccountStatus))}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('createdAt')}:
                </p>
                <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('role')}:</p>
                <p>{response?.role?.RoleName}</p>
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
