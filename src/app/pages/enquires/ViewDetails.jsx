// Import Dependencies
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// Local Imports
import { Button, Card, Skeleton } from 'components/ui';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import EnquiresService from 'services/enquires.service';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { enquiresStatusOptions } from './helper';

export default function ViewDetails() {
  const { t } = useTranslation();
  const { restrictionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);

  const pageTitle = t('enquires');

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const result = await EnquiresService.detail(restrictionId);
      if (result?.status === 200) {
        setDetail(result.response?.data || result.response?.Data || {});
      } else {
        const errorMsg = result?.error || result?.response?.message || 'Failed to fetch details';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Error in fetchDetails (Enquires):', err);
      setError('An error occurred while fetching details');
    } finally {
      setLoading(false);
    }
  }, [restrictionId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const breadcrumbItem = [{ title: t('enquires'), path: '/enquires' }, { title: t('details') }];

  const field = (label, value) => (
    <div>
      <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{label}</p>
      <p className="tracking-wide text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500">
        {value ?? '-'}
      </p>
    </div>
  );

  // Normalize some expected fields
  const subject = detail?.Subject || detail?.subject;
  const description = detail?.Description || detail?.description;
  const statusVal = detail?.Status ?? detail?.status;
  const createdAt = detail?.DateCreated || detail?.createdAt;
  const email = detail?.Email || detail?.email;

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
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
          ) : detail ? (
            <>
              <Card className="p-4 sm:p-5">
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {field(t('id'), detail?.EnquiryUID || detail?.Id || detail?.ID)}
                  {field(t('subject'), subject)}
                  {field(t('description'), description)}
                  {field(
                    t('status'),
                    enquiresStatusOptions.find((opt) => opt.value === statusVal)?.label || statusVal
                  )}
                  {field(t('createdAt'), createdAt ? getDateInUTCToTimeZone(createdAt) : '-')}
                  {field(t('email'), email)}
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
              {t('noData')}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
