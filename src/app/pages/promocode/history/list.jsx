import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

import { RiCashFill } from 'react-icons/ri';
import PromoCodeService from 'services/promocode.services';
import {
  currencyTypeToAPP,
  discountTypeToAPP,
  displayTypeToAPP,
  historyResponseMapper,
  parsePromoCodeStateToApp,
  parsePromoCodeStatus,
  segmentationTypeToAPP,
  typeToAPP
} from '../helper';
import { Card, Skeleton } from 'components/ui';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { Toolbar } from './Toolbar';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
// import { Toolbar } from './Toolbar';

export default function PromocodeHistory() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cardData, setCardData] = useState();
  const [loading, setLoading] = useState();
  const [response, setResponse] = useState();
  const pageTitle = t('promocode') + ' ' + t('history');
  const { promocodeId } = useParams();

  const breadcrumbs = [{ title: t('promocode'), path: '/promocode' }, { title: t('history') }];

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

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

  const fetchPromocodeHistory = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await PromoCodeService.getPromocodeHistory({
      pagination: { pageIndex, pageSize },
      promocodeId
    });

    const apiData = historyResponseMapper(result.response.data);

    const recordsCount = parseInt(result.response.totalRecords, 10) || 0;
    const uniqueUsers = parseInt(result.response.uniqueUsers, 10) || 0;
    const depositAmount = parseInt(result.response.depositAmount, 10) || 0;
    const benefitAmount = parseInt(result.response.benefitAmount, 10) || 0;

    if (result.status === 200) {
      setCardData({
        recordsCount,
        uniqueUsers,
        depositAmount,
        benefitAmount
      });
      return {
        status: 200,
        data: apiData,
        totalRecords: parseInt(result.response?.totalRecords)
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData: fetchPromocodeHistory,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { enableFullScreen: false },
      columnVisibility: { rejectReason: false }
    }
  });

  useEffect(() => {
    fetchPromocodeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promocodeId]);

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper
      pageTitle={pageTitle}
      title={pageTitle}
      enableFullScreen={tableSettings.enableFullScreen}>
      <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
        <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
          {pageTitle}
        </h2>
        <div className="hidden self-stretch py-1 sm:flex">
          <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
        </div>
        <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 px-[--margin-x] sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 2xl:gap-6">
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardData?.recordsCount}
            </p>
            <RiCashFill className="size-8" />
          </div>
          <p className="mt-1 text-xs+">{t('record') + ' ' + t('count')}</p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardData?.uniqueUsers}
            </p>
            <RiCashFill className="size-8" />
          </div>
          <p className="mt-1 text-xs+">{t('unique') + ' ' + t('user')}</p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardData?.depositAmount}
            </p>
            <RiCashFill className="size-8" />
          </div>
          <p className="mt-1 text-xs+">{t('deposit') + ' ' + t('amount')}</p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardData?.benefitAmount}
            </p>
            <RiCashFill className="size-8" />
          </div>
          <p className="mt-1 text-xs+">{t('benefit') + ' ' + t('amount')}</p>
        </div>
      </div>

      <div className="col-span-12 m-3 sm:col-span-8 lg:col-span-9">
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
                <p>{response?.PromoCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('status')}
                </p>
                <p>{capitalizeFirstLetter(parsePromoCodeStatus(response?.Status))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('state')}</p>
                <p>{capitalizeFirstLetter(parsePromoCodeStateToApp(response?.State))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('currency')}
                </p>
                <p>{capitalizeFirstLetter(currencyTypeToAPP(response?.Currency))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('type')}</p>
                <p>{capitalizeFirstLetter(typeToAPP(response?.Type))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('discount')}
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
                  {t('visibility')}
                </p>
                <p>{capitalizeFirstLetter(displayTypeToAPP(response?.Visibility))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('segmentation') + ' ' + t('type')}
                </p>
                <p>{capitalizeFirstLetter(segmentationTypeToAPP(response?.SegmentationType))}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('createdAt')}
                </p>
                <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Toolbar table={table} title={t('title')} pageTitle={t('user') + ' ' + t('list')} />

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
