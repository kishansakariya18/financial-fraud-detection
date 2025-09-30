import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { agentTransactionsResponseMapper } from '../../helper';
import { AgentTransactionColumns } from './columns';

export default function AgentTransactionList({ agentUID: propAgentUID, breadcrumbs = null }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const agentUID = propAgentUID || params.agentUID;
  const pageTitle = t('transactions');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAgentTransactions = useCallback(async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await B2BAgentWalletService.agentTransactionList({
      pagination: { pageIndex, pageSize },
      creditDebitType: queryParams.creditDebitType,
      transactionType: queryParams.transactionType,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      agentUID
    });

    if (result.status === 200) {
      const response = agentTransactionsResponseMapper(result.response);
      return {
        status: 200,
        data: response.list,
        totalRecords: response.totalRecords || 0
      };
    }
    return { status: result.status, error: result.error };
  }, [queryParams, agentUID]);

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: AgentTransactionColumns,
    fetchData: fetchAgentTransactions,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {},
      enableGlobalFilter: true
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
    if (queryParams.transactionType) {
      filtersFromQuery.push({
        id: 'transactionType',
        value: queryParams.transactionType
      });
    }
    if (queryParams.creditDebitType) {
      filtersFromQuery.push({
        id: 'creditDebitType',
        value: queryParams.creditDebitType
      });
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
      if (data.id === 'transactionType') {
        filterItems.transactionType = data.value;
      }
      if (data.id === 'creditDebitType') {
        filterItems.creditDebitType = data.value;
      }
      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.transactionType && {
        transactionType: filterItems.transactionType
      }),
      ...(filterItems.creditDebitType && {
        creditDebitType: filterItems.creditDebitType
      }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
    table.setGlobalFilter('');
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        table={table}
        pageTitle={pageTitle}
        breadcrumbs={breadcrumbs}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
