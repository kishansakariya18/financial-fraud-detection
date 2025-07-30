// Import Dependencies
import { useEffect, useState } from 'react';

// Local Imports
import { Button, Card, Skeleton } from 'components/ui';
import { useNavigate, useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import UserManualDepositTransactionService from 'services/user-manual-deposit-transaction.services';
import { toast } from 'sonner';
import { apiConfig } from 'configs/api.config';

export default function View() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const pageTitle = t('user_manual_deposit_transaction_detail');

  const fetchTransactionDetails = async () => {
    setLoading(true);
    const result =
      await UserManualDepositTransactionService.getUserManualDepositTransactionDetail(id);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  const breadcrumbItem = [
    {
      title: t('user_manual_deposit_transaction'),
      path: '/user-manual-deposit-transaction'
    },
    { title: pageTitle }
  ];

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex w-full items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
          <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          {loading && !response ? (
            [...Array(10)].map((_, i) => (
              <Skeleton key={i} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
            ))
          ) : (
            <Card className="h-full p-4 sm:p-5">
              <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('transaction_information')}
              </h6>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('user_id')}
                  </p>
                  <p>{response?.UserID}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('amount')}
                  </p>
                  <p>{response?.Amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('bank_transaction_id')}
                  </p>
                  <p>{response?.BankTransactionID}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('deposit_time')}
                  </p>
                  <p>{new Date(response?.DepositTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('status')}
                  </p>
                  <p>{response?.DepositStatus === 0 ? 'Pending' : 'Verified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('rejection_reason')}
                  </p>
                  <p>{response?.RejectionReason || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('remarks')}
                  </p>
                  <p>{response?.Remarks || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('date_created')}
                  </p>
                  <p>{new Date(response?.DateCreated).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('last_modified')}
                  </p>
                  <p>{new Date(response?.DateModified).toLocaleString()}</p>
                </div>
              </div>
              {response?.ScreenshotURL && (
                <div className="mt-5 space-y-4">
                  <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                    {t('screenshot')}
                  </h6>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <img
                      width={500}
                      height={500}
                      src={apiConfig.baseURL.S3_URL + '/upload/deposits/' + response?.ScreenshotURL}
                      alt="Transaction Screenshot"
                      className="h-auto max-w-full rounded-lg border border-gray-300 dark:border-dark-500"
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button
                  className="min-w-[7rem]"
                  onClick={() => navigate('/user-manual-deposit-transaction')}>
                  {t('back')}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}
