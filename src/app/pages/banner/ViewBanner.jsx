// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from 'react';

// Local Imports
import { Button, Card, Skeleton } from 'components/ui';
import { useNavigate, useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { parseBannerStatus } from './helper';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import BannerService from 'services/banner.services';
import apiConfig from 'configs/api.config';
import RenderImage from 'components/ui/custom/ImageRender';

export default function ViewBannerDetails() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { bannerId } = useParams();
  const pageTitle = t('banner') + ' ' + t('details');
  const [bannerImage, setBannerImage] = useState('');

  const fetchBannerDetails = async () => {
    setLoading(true);
    const result = await BannerService.getBannerDetails(bannerId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
      setBannerImage(apiData?.bannerContent[0]?.MediaFileName);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBannerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerId]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }
  const breadcrumbItem = [
    { title: t('banner'), path: '/content-management/banner' },
    { title: t('banner') + ' ' + t('details') }
  ];

  console.log('response:', response);
  console.log('loading:', loading);
  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex w-[407px] items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
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
                {t('banner') + ' ' + t('information')}
              </h6>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('banner') + ' ' + t('name')}
                  </p>
                  <p>{response?.BannerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('banner') + ' ' + t('headline')}
                  </p>
                  <p>{response?.bannerContent[0]?.HeadLine || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('banner') + ' ' + t('subHeadline')}
                  </p>
                  <p>{response?.bannerContent[0]?.SubHeadLine || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('targetUrl')}
                  </p>
                  <p>{response?.bannerContent[0]?.TargetURL || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('startDate')}:
                  </p>
                  <p>{getDateInUTCToTimeZone(response?.StartDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('endDate')}:
                  </p>
                  <p>{getDateInUTCToTimeZone(response?.EndDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('status')}
                  </p>
                  <p>
                    {+response?.IsActive >= 0 &&
                      capitalizeFirstLetter(parseBannerStatus(+response?.IsActive))}
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-1">
                  {bannerImage && (
                    <RenderImage
                      id={'bannerImage'}
                      label="Banner Image :"
                      value={`${apiConfig.baseURL.S3_URL}/banner/${bannerImage}`}
                      maxWidth="300px"
                      maxHeight="300px"
                    />
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button
                  className="min-w-[7rem]"
                  onClick={() => navigate('/content-management/banner')}>
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
