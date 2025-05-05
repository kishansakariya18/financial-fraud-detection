import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { transactionResponseMapper } from '../helper';
import AffiliateService from 'services/affiliate.services';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { BanknotesIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import { Checkbox } from 'components/ui';

export default function AffiliateTransactions() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('transaction') + ' ' + t('history');
  const { affiliateId } = useParams();
  const cardDataRef = useRef();
  const affiliateDataRef = useRef();

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAffiliateTransactions = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await AffiliateService.affiliateTransactionList({
      pagination: { pageIndex, pageSize },
      filters: queryParams,
      affiliateUID: affiliateId
    });

    const apiData = transactionResponseMapper(result.response);

    cardDataRef.current = {
      totalSignup: apiData.totalSignup || 0,
      totalDeposit: apiData.totalDeposit || 0,
      totalCommission: apiData.totalCommission || 0
    };

    affiliateDataRef.current = apiData.affiliateData;

    if (result.status === 200) {
      return {
        status: 200,
        data: apiData.list,
        totalRecords: parseInt(apiData.totalRecords)
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchAffiliateTransactions,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { enableFullScreen: false },
      columnVisibility: { firstName: false, lastName: false }
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'username', value: queryParams.keyword });
    }
    if (queryParams.transactionType) {
      filtersFromQuery.push({ id: 'transactionType', value: queryParams.transactionType });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'createdAt',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'username') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
      if (data.id === 'transactionType') {
        filterItems.transactionType = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.transactionType && { transactionType: filterItems.transactionType }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] })
    });
  };

  console.log('affiliateData ref: ', affiliateDataRef.current);

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper
      pageTitle={pageTitle}
      title={pageTitle}
      enableFullScreen={tableSettings.enableFullScreen}>
      <div className="mt-4 grid grid-cols-2 gap-3 px-[--margin-x] sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 2xl:gap-6">
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardDataRef?.current?.totalSignup}
            </p>
            <UserPlusIcon className="size-5 text-info" />
          </div>
          <p className="mt-1 text-xs+">{t('total') + ' ' + t('signup')}</p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardDataRef.current?.totalDeposit}
            </p>
            <BanknotesIcon className="size-5 text-success" />
          </div>
          <p className="mt-1 text-xs+">{t('total') + ' ' + t('deposit')}</p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              {cardDataRef.current?.totalCommission}
            </p>
            <CheckBadgeIcon className="size-5 text-success" />
          </div>
          <p className="mt-1 text-xs+">{t('total') + ' ' + t('commission')}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-[--margin-x] sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 2xl:gap-6">
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <Checkbox
              color="info"
              disabled
              checked={affiliateDataRef.current?.IsSignupCommissionEnabled}
              label={t('per') + ' ' + t('signup')}
            />
          </div>
          <p className="mt-2 text-xs+">
            {t('per') + ' ' + t('signup')} : {affiliateDataRef.current?.SignupCommissionAmount}
          </p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <Checkbox
              color="info"
              disabled
              checked={affiliateDataRef.current?.IsDepositCommissionEnabled}
              label={t('per') + ' ' + t('deposit')}
            />
          </div>
          <p className="mt-2 text-xs+">
            {t('per') + ' ' + t('deposit')} : {affiliateDataRef.current?.DepositCommissionAmount}
          </p>
        </div>
        <div className="rounded-lg bg-gray-150 p-3 dark:bg-dark-700 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <Checkbox
              color="info"
              disabled
              checked={affiliateDataRef.current?.IsUserLossCommissionEnabled}
              label={t('user') + ' ' + t('loss')}
            />
          </div>
          <p className="mt-2 text-xs+">
            {t('user') + ' ' + t('loss')} : {affiliateDataRef.current?.UserLossCommissionAmount}
          </p>
        </div>
      </div>

      <Toolbar
        table={table}
        pageTitle={pageTitle}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
