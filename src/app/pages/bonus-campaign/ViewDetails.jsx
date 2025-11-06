// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from 'react';

// Local Imports
import { Button, Card, Skeleton } from 'components/ui';
import { useNavigate, useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
// import { useClipboard } from 'hooks';
import { toast } from 'sonner';
import BonusCampaignService from 'services/bonus-campaign.services';
import {
  discountTypeToAPP,
  parseCampaignStatus,
  segmentationTypeToAPP,
  wageringRequirementTypeToAPP
} from './helper';
import { useClipboard } from 'hooks';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';
import apiConfig from 'configs/api.config';
import RenderImage from 'components/ui/custom/ImageRender';

export function ViewDetails() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { bonusCampaignId } = useParams();
  const pageTitle = t('bonusCampaign') + ' ' + t('details');
  const { copied, copy } = useClipboard({ timeout: 2000 });
  const [bonusImage, setBonusImage] = useState('');

  const breadcrumbs = [
    { title: t('bonusCampaign'), path: '/bonus-campaign' },
    { title: 'Details' }
  ];

  const fetchBonusCampaignDetails = async () => {
    setLoading(true);
    const result = await BonusCampaignService.getBonusCampaignDetails(bonusCampaignId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
      setBonusImage(apiData?.ImageName);
      console.log('response:', response);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBonusCampaignDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bonusCampaignId]);

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
                {t('bonusCampaign') + ' ' + t('information')}
              </h6>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('campaignName')}
                  </p>
                  <p>{response?.CampaignName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('campaignCode')}
                  </p>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span> {response?.CampaignCode || '-'}</span>

                    <Button
                      data-tooltip
                      data-tooltip-content={copied ? 'Copied' : 'Copy'}
                      onClick={() => copy(response?.PromoCode)}
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
                    {t('bonusCampaign') + ' ' + t('status')}
                  </p>
                  <p>{capitalizeFirstLetter(parseCampaignStatus(response?.CampaignStatus))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {`${t('minimum')} ${t('deposit')} ${t('amount')}`}
                  </p>
                  <p>{response?.MinDepositAmount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('discount') + ' ' + t('type')}
                  </p>
                  <p>{capitalizeFirstLetter(discountTypeToAPP(response?.BonusType))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('discount') + ' ' + t('amount')}
                  </p>
                  <p>{`${response?.BonusValue} ${response?.BonusType === 1 ? '%' : ''}`}</p>
                </div>
                {response?.BonusType === 1 && (
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {`${t('maximum')} ${t('bonus')} ${t('amount')}`}
                    </p>
                    <p>{response?.MaxBonusAmount}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('bonusCampaign') + ' ' + t('quantity')}
                  </p>
                  <p>{response?.TotalMaxRedemptions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('eligible') + ' ' + t('currency')}
                  </p>
                  <p>{response?.EligibleCurrencies?.map((e) => e).join(', ') || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('allowedPerUser')}
                  </p>
                  <p>{response?.MaxRedemptionsPerUser}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {`${t('bonus')} ${t('expiry')} ${t('days')}`}
                  </p>
                  <p>{response?.BonusExpiryDays}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('segmentation') + ' ' + t('type')}
                  </p>
                  <p>{capitalizeFirstLetter(segmentationTypeToAPP(response?.SegmentationType))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('segmentation')}
                  </p>
                  <p>{response?.segmentation ? response?.segmentation?.Name : '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('bonusCampaign') + ' ' + t('startAt')}
                  </p>
                  <p>{getDateInUTCToTimeZone(response?.StartDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('bonusCampaign') + ' ' + t('endAt')}
                  </p>
                  <p>{getDateInUTCToTimeZone(response?.EndDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('createdAt')}
                  </p>
                  <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
                </div>
              </div>

              <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>

              <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('Wagering') + ' ' + t('information')}
              </h6>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {`${t('wagering')} ${t('categories')}`}
                  </p>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span>
                      {' '}
                      {response?.WageringCategories && response?.WageringCategories?.length
                        ? `${response.WageringCategories.map((category) => category.Name).join(', ')}`
                        : '-'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {`${t('wagering')} ${t('multiplier')}`}
                  </p>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span>
                      {' '}
                      {response?.WageringMultiplier ? `${response?.WageringMultiplier}x` : '-'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('wagering') + ' ' + t('requirement')}
                  </p>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span>
                      {' '}
                      {wageringRequirementTypeToAPP(response?.WageringRequirementType) || '-'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {`${t('cashout')} ${t('multiplier')}`}
                  </p>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span>
                      {' '}
                      {response?.CashoutMultiplier ? `${response?.CashoutMultiplier}x` : '-'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('claimSettlement')}
                  </p>
                  <p>{response?.ClaimMethod === 'AUTO' ? t('autoCredit') : t('manualCredit')}</p>
                </div>
              </div>
              <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>
              <div className="mt-4 grid gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {`${t('short')} ${t('message')}`}
                  </p>
                  <p>{response?.ShortMessage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {`${t('title')} ${t('message')}`}
                  </p>
                  <p>{response?.TitleMessage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('description')}:
                  </p>
                </div>
                <div className="mt-1 w-full rounded border border-gray-200 p-4">
                  <p
                    dangerouslySetInnerHTML={{ __html: response?.Description }}
                    className="mt-2 text-sm text-gray-700"
                  />
                </div>
              </div>
              <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-1">
                  {bonusImage && (
                    <RenderImage
                      id={'bonusImage'}
                      label="Image :"
                      value={`${apiConfig.baseURL.S3_URL}/campaign/${bonusImage}`}
                      maxWidth="300px"
                      maxHeight="300px"
                    />
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button className="min-w-[7rem]" onClick={() => navigate('/bonus-campaign')}>
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
