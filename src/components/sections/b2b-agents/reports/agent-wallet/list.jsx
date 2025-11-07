// Import Dependencies
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

// Local Imports
import { useLockScrollbar } from 'hooks';
import { AgentWalletSummaryCard } from './SummaryCard';
import { responseMapper } from './helper';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import useTable from 'components/ui/useTable';
import { getQueryParams } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { useCurrencyContext } from 'app/contexts/currency/context';
import { agentWalletColumns, AgentWalletFilters } from '.';
import { parseAgentStatusToApi, parseAgentTypeToApi } from 'components/sections/b2b-agents/helper';
import moment from 'moment-timezone';

// ----------------------------------------------------------------------

export default function AgentWalletList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('Agent Wallet Report');
  const [summary, setSummary] = useState(null);
  const { formatCurrency } = useCurrencyContext();

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAgentWalletReport = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const params = {
      page: pageIndex + 1, // API uses 1-based pagination
      limit: pageSize
    };

    // Add filters
    if (queryParams.agentName) {
      params.keyword = queryParams.agentName;
    }
    if (queryParams.agentID) {
      params.agentID = queryParams.agentID;
    }
    if (queryParams.status) {
      params.status = parseAgentStatusToApi(queryParams.status);
    }
    if (queryParams.agentType) {
      params.agentType = parseAgentTypeToApi(queryParams.agentType);
    }
    if (queryParams.startDate && queryParams.endDate) {
      params.startDate = moment(+queryParams.startDate).startOf('day').toDate();
      params.endDate = moment(+queryParams.endDate).endOf('day').toDate();
    }
    return B2BAgentWalletService.getAgentWalletReport(params)
      .then(({ response }) => {
        const { data = [], totalRecords = 0, summary = {} } = response;
        setSummary(summary);
        return {
          status: 200,
          data: responseMapper(data || []),
          totalRecords
        };
      })
      .catch((error) => {
        toast.error(error || 'An error occurred while fetching the report');
        return { status: 500, error: error || 'An error occurred while fetching the report' };
      });
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: agentWalletColumns(formatCurrency),
    fetchData: fetchAgentWalletReport,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: [], right: [] },
      tableSettings: {}
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, isLoading, setError]);

  useEffect(() => {
    const filtersFromQuery = [];

    if (queryParams.agentName) {
      filtersFromQuery.push({ id: 'agentName', value: queryParams.agentName });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }
    if (queryParams.agentType) {
      filtersFromQuery.push({ id: 'agentType', value: queryParams.agentType });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'createdAt',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }

    setColumnFilters(filtersFromQuery);
  }, [queryParams, setColumnFilters]);

  const applyFilterHandler = () => {
    const filterItems = {};

    for (let data of table.getState().columnFilters) {
      if (data.id === 'agentName') {
        filterItems.agentName = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
      if (data.id === 'agentType') {
        filterItems.agentType = data.value;
      }
      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.agentName && { agentName: filterItems.agentName }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.agentType && { agentType: filterItems.agentType }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems.date[1] })
    });
  };

  const clearFilterHandler = () => {
    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD
    });
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <AgentWalletSummaryCard summary={summary} loading={isLoading} />
      <AgentWalletFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
