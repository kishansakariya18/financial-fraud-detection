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
import PromoCodeService from 'services/promocode.services';
import {
  currencyTypeToAPP,
  discountTypeToAPP,
  displayTypeToAPP,
  parsePromoCodeStateToApp,
  parsePromoCodeStatus,
  segmentationTypeToAPP,
  typeToAPP
} from './helper';
import { useClipboard } from 'hooks';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';

export function ViewDetails() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { promocodeId } = useParams();
  const pageTitle = t('promocode') + ' ' + t('details');
  const { copied, copy } = useClipboard({ timeout: 2000 });

  const breadcrumbs = [{ title: t('promocode'), path: '/promocode' }, { title: 'Details' }];

  const fetchPromocodeDetails = async () => {
    setLoading(true);
    const result = await PromoCodeService.getPromocodeDetail(promocodeId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPromocodeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promocodeId]);

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
                {t('promocode') + ' ' + t('information')}
              </h6>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('promocode')}
                  </p>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span> {response?.PromoCode || '-'}</span>

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
                    {t('promocode') + ' ' + t('status')}
                  </p>
                  <p>{capitalizeFirstLetter(parsePromoCodeStatus(response?.PromoCodeStatus))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('state')}
                  </p>
                  <p>{capitalizeFirstLetter(parsePromoCodeStateToApp(response?.PromoCodeState))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('benefit') + ' ' + t('currency') + ' ' + t('type')}
                  </p>
                  <p>{capitalizeFirstLetter(currencyTypeToAPP(response?.BenefitCurrencyType))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('depositRequirement') + ' ' + t('type')}
                  </p>
                  <p>{capitalizeFirstLetter(typeToAPP(response?.DepositRequirementType))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('isFirstDepositOnly')}
                  </p>
                  <p>{response?.IsFirstDepositOnly ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('isSecondDepositOnly')}
                  </p>
                  <p>{response?.IsSecondDepositOnly ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('amount')}
                  </p>
                  <p>{response?.Amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('min') + ' ' + t('amount')}
                  </p>
                  <p>{response?.MinAmount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('max') + ' ' + t('amount')}
                  </p>
                  <p>{response?.MaxAmount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('expiration') + ' ' + t('startAt')}
                  </p>
                  <p>{getDateInUTCToTimeZone(response?.StartDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('expiration') + ' ' + t('endAt')}
                  </p>
                  <p>{getDateInUTCToTimeZone(response?.EndDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('usageLimit')}
                  </p>
                  <p>{response?.UsageLimit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('exact') + ' ' + t('amount')}
                  </p>
                  <p>{response?.ExactAmount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('benefitCap')}
                  </p>
                  <p>{response?.BenefitCap}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('discount') + ' ' + t('type')}
                  </p>
                  <p>{discountTypeToAPP(response?.DiscountType)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('isPublicVisible')}
                  </p>
                  <p>{capitalizeFirstLetter(displayTypeToAPP(response?.IsPubliclyVisible))}</p>
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
                  <p>{response?.segmentations?.map((seg) => seg.Name).join(', ') || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('createdAt')}
                  </p>
                  <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
                </div>
              </div>

              <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>

              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button className="min-w-[7rem]" onClick={() => navigate('/promocode')}>
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
