// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from 'react';

// Local Imports
import { Button, Card, Skeleton } from 'components/ui';
import { useNavigate, useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { playerStatusToApp } from './helper';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import PlayerService from 'services/player.services';
import { showImage } from 'utils/showImage';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { useClipboard } from 'hooks';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';
import { toast } from 'sonner';
const breadcrumbs = [{ title: 'Players', path: '/player' }, { title: 'Details' }];

export function ViewDetails() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { playerId } = useParams();
  const pageTitle = t('player') + ' ' + t('details');
  const { copied, copy } = useClipboard({ timeout: 2000 });

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

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

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
          {loading ? (
            [...Array(10)].map((_, i) => (
              <Skeleton key={i} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
            ))
          ) : (
            <Card className="h-full p-4 sm:p-5">
              <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('player') + ' ' + t('information')}
              </h6>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('userName')}
                  </p>
                  <p>{response?.Username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('email')}
                  </p>
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
                    {t('mobile')}
                  </p>

                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span>
                      {response?.dialCode || '+91'} {response?.Mobile}
                    </span>
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
                  </div>
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
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span>{response?.Address || '-'}</span>
                    {response.Address && (
                      <Button
                        data-tooltip
                        data-tooltip-content={copied ? 'Copied' : 'Copy'}
                        onClick={() => copy(response?.Address)}
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
                    {t('referralCode')}
                  </p>

                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span>{response?.ReferralCode}</span>

                    <Button
                      data-tooltip
                      data-tooltip-content={copied ? 'Copied' : 'Copy'}
                      onClick={() => copy(response?.ReferralCode)}
                      isIcon
                      variant="flat"
                      className="size-5 rounded-full group-hover/td:opacity-100"
                      aria-label="Copy Button">
                      <DocumentDuplicateIcon className="size-3.5" />
                    </Button>
                  </div>
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
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('last_login_ip')}
                  </p>
                  <p>{response?.LastLoginIP || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('pan') + t('status')}
                  </p>
                  <p>
                    {response?.PanDetail !== null &&
                    (response?.IsPanVerified === 1 || response?.IsPanVerified === true)
                      ? `${response.PanDetail} (Verified)`
                      : `Pending`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('bank') + t('status')}
                  </p>
                  <p>
                    {response?.BankDetail !== null &&
                    (response?.IsBankVerified === 1 || response?.IsBankVerified === true)
                      ? `${response.BankDetail} (Verified)`
                      : `Pending`}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button className="min-w-[7rem]" onClick={() => navigate('/player')}>
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
