import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import AffiliatesService from 'services/affiliates.services';
import { referredTxnResponseMapper } from './helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

export default function AffiliateUsersTransactions() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userID, affiliateId } = useParams();
  const pageTitle = t('transactions');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchTransactions = useCallback(async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const result = await AffiliatesService.getAffiliatesTransactions({
      affiliateId,
      pagination: { pageIndex, pageSize },
      filters: queryParams,
      userID
    });

    if (result.status === 200) {
      const mapped = referredTxnResponseMapper(result.response);
      return {
        status: 200,
        data: mapped.list || [],
        totalRecords: parseInt(mapped.totalRecords, 10) || 0
      };
    }
    return { status: result.status, error: result.error };
  }, [userID, queryParams]);

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchTransactions,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: [] },
      tableSettings: { enableFullScreen: false }
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
    if (queryParams.type) {
      // API uses REVSHARE/CPA; convert to table filter values
      const planType = String(queryParams.type).toUpperCase() === 'CPA' ? 'cpa' : 'revshare';
      filtersFromQuery.push({ id: 'planType', value: planType });
    }
    // Map numeric txnStatus from query (0,1,2) to table filter values
    if (typeof queryParams.txnStatus !== 'undefined' && queryParams.txnStatus !== null) {
      const s = String(queryParams.txnStatus);
      let v = [];
      if (s.includes(',')) {
        v = s.split(',').map((x) => (x === '1' ? 'success' : x === '2' ? 'failed' : 'pending'));
      } else {
        v = [s === '1' ? 'success' : s === '2' ? 'failed' : 'pending'];
      }
      filtersFromQuery.push({ id: 'status', value: v });
    }
    if (queryParams.currencyID) {
      filtersFromQuery.push({ id: 'currencyID', value: String(queryParams.currencyID) });
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
      if (data.id === 'username') filterItems.keyword = data.value;
      if (data.id === 'planType') filterItems.planType = data.value; // 'revshare' | 'cpa'
      if (data.id === 'createdAt') filterItems.date = data.value;
      if (data.id === 'currencyID') filterItems.currencyID = data.value;
      if (data.id === 'status')
        filterItems.status = Array.isArray(data.value) ? data.value : [data.value];
    }

    // Map planType to API 'type' param (REVSHARE/CPA)
    const apiType = filterItems.planType
      ? filterItems.planType === 'cpa'
        ? 'CPA'
        : filterItems.planType === 'revshare'
          ? 'REVSHARE'
          : filterItems.planType === 'transfer'
            ? 'TRANSFER'
            : undefined
      : undefined;

    // Map status labels to API txnStatus enums (0-pending,1-success,2-failed)
    const statusToEnum = (s) => (s === 'success' ? '1' : s === 'failed' ? '2' : '0');
    const apiTxnStatus =
      filterItems.status && filterItems.status.length
        ? filterItems.status.map(statusToEnum).join(',')
        : undefined;

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(apiType && { type: apiType }),
      ...(apiTxnStatus && { txnStatus: apiTxnStatus }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems.date[1] }),
      ...(filterItems.currencyID && { currencyID: filterItems.currencyID }),
      ...(queryParams.userID && { userID: queryParams.userID })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      const base = { pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD };
      setSearchParams(queryParams.userID ? { ...base, userID: queryParams.userID } : base);
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
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
