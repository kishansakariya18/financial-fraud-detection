import { useEffect, useState } from 'react';
import { Button, Card, GhostSpinner } from 'components/ui';
import PagesService from 'services/pages.services';
import { useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { useTranslation } from 'react-i18next';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useClipboard } from 'hooks';
import { pagesStatusToAPP } from './helper';
// import { TextEditor } from 'components/shared/form/TextEditor';
// import Quill, { Delta } from 'quill';

const ViewDetails = () => {
  const { t } = useTranslation();
  const pageTitle = t('page') + ' ' + t('details');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  // const [htmlContent, setHtmlContent] = useState('');
  // const [content, setContent] = useState(new Delta([{ insert: htmlContent }]));
  const { copied, copy } = useClipboard({ timeout: 2000 });
  const { pageID } = useParams();

  const fetchPagesDetails = async () => {
    try {
      setLoading(true);
      const result = await PagesService.pagesDetail(pageID);

      if (result) {
        if (result.status === 200 || result.status === 201) {
          // return result.response.data;
          setResponse(result.response.data);
        } else {
          setError(result.error);
        }
        setLoading(false);
      }
    } catch (error) {
      console.log('err: ', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchPagesDetails();
    // .then((result) => {
    //   if (result) {
    //     const quill = new Quill(document.createElement('div'));
    //     quill.root.innerHTML = result?.Content || '';
    //     quill.setContents(result?.Content);
    //     const delta = quill.getContents();
    //     console.log('delta is ', delta);
    //     setHtmlContent(result?.Content || '');
    //     setContent(delta);
    //   }
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageID]);

  // const handleChange = (val) => {
  //   setContent(val);
  //   const quill = new Quill(document.createElement('div'));
  //   quill.setContents(val);
  //   setHtmlContent(quill.root.innerHTML);
  // };

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          {pageTitle}
        </h2>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <Card className="h-full p-4 sm:p-5">
            <h6 className="mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
              {t('page') + ' ' + t('information')}:
            </h6>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('page') + ' ' + t('name')}:
                </p>
                <p>
                  <span>{response?.Name}</span>
                  {response.Name && (
                    <Button
                      data-tooltip
                      data-tooltip-content={copied ? 'Copied' : 'Copy'}
                      onClick={() => copy(response?.Name)}
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
                  {t('page') + ' ' + t('status')}:
                </p>
                <p>{capitalizeFirstLetter(pagesStatusToAPP(response?.IsActive))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('createdAt')}:
                </p>
                <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('content')}:
                </p>
                <p dangerouslySetInnerHTML={{ __html: response?.Content }} />
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
