// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from 'react';

// Local Imports
import { Button, Card, GhostSpinner } from 'components/ui';
import { useNavigate, useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { playerStatusToApp } from './helper';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import PlayerService from 'services/player.services';
import { showImage } from 'utils/showImage';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
const breadcrumbs = [{ title: 'Players', path: '/player' }, { title: 'Details' }];

export function ViewDetails() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { playerId } = useParams();
  const pageTitle = t('player') + ' ' + t('details');

  const fetchPlayerDetails = async () => {
    setLoading(true);
    const result = await PlayerService.userDetail(playerId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

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
          <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
        </div>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <Card className="h-full p-4 sm:p-5">
            <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">{t('details')}</h5>
            <p className="text-sm text-gray-500 dark:text-dark-200">
              {t('details') + ' ' + t('regarding') + ' ' + t('player')}
            </p>

            <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
              {t('information')}
            </h6>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('userName')}
                </p>
                <p>{response?.Username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('email')}</p>
                <p>{response?.Email || 'not-provide'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('mobile')}
                </p>
                <p>
                  {response?.dialCode || '+91'} {response?.Mobile}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('realCash')}
                </p>
                <p>{response?.RealCash || '0'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('status')}
                </p>
                <p>{+response.Status >= 0 && playerStatusToApp(+response?.Status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('gender')}
                </p>
                <p>{response?.Gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">DOB:</p>
                <p>{response?.DOB || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('address')}
                </p>
                <p>{response?.Address || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('referralCode')}
                </p>
                <p>{response?.ReferralCode || '-'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('createdAt')}:
                </p>
                <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('image') + ' ' + t('preview')}
                </p>
                <div className="mt-2">
                  {response?.ImageName && showImage('user', response?.ImageName)}
                  {response?.ImageName}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
              <Button className="min-w-[7rem]" onClick={() => navigate('/player')}>
                {t('back')}
              </Button>
              {loading && <GhostSpinner className="size-4 border-2" />}
              {error && <p>{error}</p>}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
