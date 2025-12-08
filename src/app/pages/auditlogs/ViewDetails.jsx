import { useEffect, useState } from 'react';
import { Button, Card, GhostSpinner } from 'components/ui';
import AuditLogService from 'services/audit-logs.services';
import { useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { useTranslation } from 'react-i18next';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useClipboard } from 'hooks';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
// import { viewResponseMapper } from './helper';
// import { TextEditor } from 'components/shared/form/TextEditor';
// import Quill, { Delta } from 'quill';
import ObjectDiff from './ObjectDiff';

const ViewDetails = () => {
  const { t } = useTranslation();
  const pageTitle = t('audit_logs') + ' ' + t('details');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  // const [htmlContent, setHtmlContent] = useState('');
  // const [content, setContent] = useState(new Delta([{ insert: htmlContent }]));
  const { copied, copy } = useClipboard({ timeout: 2000 });
  const { auditLogID } = useParams();
  const breadcrumbItem = [{ title: t('audit_logs'), path: '/auditlogs' }, { title: t('details') }];

  const fetchLogDetails = async () => {
    try {
      setLoading(true);
      const result = await AuditLogService.auditLogsDetail(auditLogID);

      if (result) {
        if (result.status === 200 || result.status === 201) {
          // return result.response.data;
          // const apiData = viewResponseMapper([result.response.data]);
          setResponse(result.response.data);
        } else {
          setError(result.error);
        }
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchLogDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditLogID]);

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <Card className="h-full p-4 sm:p-5">
            <h6 className="mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
              {t('audit_logs') + ' ' + t('information')}:
            </h6>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('module') + ' ' + t('name')}:
                </p>
                <p>{response?.ModuleName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('event') + ' ' + t('name')}:
                </p>
                <p>{response?.EventName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('url')}:</p>
                {response?.URL ? (
                  <a
                    href={response.URL}
                    className="break-all text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300">
                    {response.URL}
                  </a>
                ) : (
                  <p>—</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('ipAddress')}:
                </p>
                <p>{response?.IPAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('createdBy')}:
                </p>
                <p>
                  <span>{response?.auditAdmin?.Username ?? response?.Username}</span>
                  {response.auditAdmin?.Username && (
                    <Button
                      data-tooltip
                      data-tooltip-content={copied ? 'Copied' : 'Copy'}
                      onClick={() => copy(response?.auditAdmin?.Username)}
                      isIcon
                      variant="flat"
                      className="size-5 rounded-full group-hover/td:opacity-100"
                      aria-label="Copy Button">
                      <DocumentDuplicateIcon className="size-3.5" />
                    </Button>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('createdAt')}:
                </p>
                <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
              </div>
              <div className="col-span-full">
                <ObjectDiff oldData={response?.OldValues} newData={response?.NewValues} />
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
