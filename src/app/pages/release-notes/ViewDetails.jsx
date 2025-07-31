// Import Dependencies
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// Local Imports
import { Button, Card, Skeleton } from 'components/ui';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import ReleaseNotesService from 'services/release-notes.services';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { useClipboard } from 'hooks';

export function ViewDetails() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [releaseNote, setReleaseNote] = useState(null);
  const [error, setError] = useState(null);
  const { releaseNoteId: releaseNoteUID } = useParams();
  const pageTitle = t('release_note');
  const { copied, copy } = useClipboard({ timeout: 2000 });

  const fetchReleaseNoteDetails = useCallback(async () => {
    try {
      setLoading(true);
      const result = await ReleaseNotesService.releaseNoteDetails(releaseNoteUID);

      if (result?.status === 200) {
        setReleaseNote(result.response?.data);
      } else {
        const errorMsg = result?.error || 'Failed to fetch release note details';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Error in fetchReleaseNoteDetails:', err);
      setError('An error occurred while fetching release note details');
    } finally {
      setLoading(false);
    }
  }, [releaseNoteUID]);

  useEffect(() => {
    fetchReleaseNoteDetails();
  }, [fetchReleaseNoteDetails]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const breadcrumbItem = [
    { title: t('release_note'), path: '/release-notes' },
    { title: t('details') }
  ];

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex w-full items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
          <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        </div>

        <div className="col-span-12">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="mt-4 h-10 w-full rounded-lg" />
            ))
          ) : releaseNote ? (
            <>
              <Card className="p-4 sm:p-5">
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('id')}
                    </p>
                    <p className="tracking-wide text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500">
                      {releaseNote?.ReleaseNoteID || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('uid')}
                    </p>
                    <span className="tracking-wide text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500">
                      {releaseNote?.ReleaseNoteUID || '-'}
                    </span>
                    {releaseNote?.ReleaseNoteUID && (
                      <Button
                        data-tooltip
                        data-tooltip-content={copied ? 'Copied' : 'Copy'}
                        onClick={() => copy(releaseNote?.ReleaseNoteUID)}
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
                      {t('version')}
                    </p>
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <span className="tracking-wide text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500">
                        {releaseNote?.Version || '-'}
                      </span>
                      {releaseNote.Version && (
                        <Button
                          data-tooltip
                          data-tooltip-content={copied ? 'Copied' : 'Copy'}
                          onClick={() => copy(releaseNote?.Version)}
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
                      {t('status')}
                    </p>
                    <p>{releaseNote?.Status === 1 ? t('active') : t('inactive')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('createdAt')}
                    </p>
                    <p>{getDateInUTCToTimeZone(releaseNote?.DateCreated) || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('modifiedAt')}
                    </p>
                    <p>{getDateInUTCToTimeZone(releaseNote?.DateModified) || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('title')}
                    </p>
                    <p>{releaseNote?.Title || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('description')}
                    </p>
                    <Card className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-dark-600 dark:bg-dark-700">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {releaseNote?.Description ? (
                          <div
                            className="whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200"
                            dangerouslySetInnerHTML={{
                              __html: releaseNote.Description.replace(/\\n/g, '<br />')
                            }}
                          />
                        ) : (
                          <span className="italic text-gray-400">-</span>
                        )}
                      </div>
                    </Card>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('release_date')}
                    </p>
                    <p>{getDateInUTCToTimeZone(releaseNote?.ReleaseDate) || '-'}</p>
                  </div>
                </div>
              </Card>
              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button className="min-w-[7rem]" onClick={() => window.history.back()}>
                  {t('back')}
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              No release note details found
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
