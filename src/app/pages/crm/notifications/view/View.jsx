// Import Dependencies
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getDateInUTCToTimeZone } from 'helpers/functions';

// Local Imports
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Button, Card, Skeleton } from 'components/ui';
import CRMService from 'services/crm.services';
import { toast } from 'sonner';

export default function NotificationView() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { notificationId } = useParams();
  const pageTitle = t('notification_detail') || 'Notification Detail';

  const fetchNotificationDetails = async () => {
    setLoading(true);
    const result = await CRMService.getNotificationDetail(notificationId);

    if (result?.status === 200) {
      setResponse(result.response?.data);
    } else {
      setError(result?.error || 'Failed to load notification');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotificationDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationId]);

  useEffect(() => {
    if (!loading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, loading]);

  const breadcrumbItem = [
    {
      title: t('crm_notifications') || 'Notifications',
      path: '/crm/notifications'
    },
    { title: pageTitle }
  ];

  const infoItem = (label, value) => (
    <div>
      <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{label}</p>
      <p>{value ?? '-'}</p>
    </div>
  );

  const recipients = Array.isArray(response?.recipientDetails) ? response.recipientDetails : [];

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
            [...Array(8)].map((_, i) => (
              <Skeleton key={i} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
            ))
          ) : (
            <Card className="h-full p-4 sm:p-5">
              <h6 className="mt-2 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('notification_information') || 'Notification Information'}
              </h6>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {infoItem(t('id') || 'ID', response?.NotificationLogID)}
                {infoItem(t('channel') || 'Channel', response?.Channel)}
                {infoItem(
                  t('recipient_group_type') || 'Recipient Group Type',
                  response?.RecipientGroupType
                )}
                {infoItem(t('type') || 'Type', response?.Type)}
                {infoItem(t('status') || 'Status', response?.Status)}
                {infoItem(t('failed_count') || 'Failed Count', response?.FailedCount)}
                {infoItem(
                  t('send_date_time') || 'Send Date Time',
                  response?.SendDateTime
                    ? getDateInUTCToTimeZone(
                        response.SendDateTime,
                        undefined,
                        'DD MMM YYYY, hh:mm A'
                      )
                    : '-'
                )}
                {infoItem(
                  t('date_created') || 'Date Created',
                  response?.DateCreated
                    ? getDateInUTCToTimeZone(
                        response.DateCreated,
                        undefined,
                        'DD MMM YYYY, hh:mm A'
                      )
                    : '-'
                )}
                {infoItem(
                  t('last_modified') || 'Last Modified',
                  response?.DateModified
                    ? getDateInUTCToTimeZone(
                        response.DateModified,
                        undefined,
                        'DD MMM YYYY, hh:mm A'
                      )
                    : '-'
                )}
              </div>

              <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('content') || 'Content'}
              </h6>
              <div className="mt-4">
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: response?.MsgBody || '-' }}
                />
              </div>

              <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('recipients') || 'Recipients'}
              </h6>
              <div className="mt-4 overflow-x-auto">
                {recipients.length === 0 ? (
                  <p className="text-center text-sm text-gray-600 dark:text-dark-300">
                    {'No data Found'}
                  </p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-500">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-dark-300">
                          UserID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-dark-300">
                          Username
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-dark-300">
                          Email
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-dark-300">
                          Mobile
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-dark-300">
                          CountryID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-dark-500">
                      {recipients.map((r) => (
                        <tr key={r.UserID}>
                          <td className="px-3 py-2 text-sm">{r.UserID}</td>
                          <td className="px-3 py-2 text-sm">{r.Username}</td>
                          <td className="px-3 py-2 text-sm">{r.Email}</td>
                          <td className="px-3 py-2 text-sm">{r.Mobile}</td>
                          <td className="px-3 py-2 text-sm">{r.CountryID}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button className="min-w-[7rem]" onClick={() => navigate('/crm/notifications')}>
                  {t('back') || 'Back'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}
