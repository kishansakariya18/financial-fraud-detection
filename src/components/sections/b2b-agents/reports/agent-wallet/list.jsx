// Import Dependencies
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

// Local Imports
import { useLockScrollbar } from 'hooks';
import { AgentWalletFilters } from './Filters';
import { AgentWalletSummaryCard } from './SummaryCard';
import { responseMapper } from './helper';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import useTable from 'components/ui/useTable';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { agentWalletColumns } from './columns';

// ----------------------------------------------------------------------

export default function AgentWalletList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('Agent Wallet Report');
  const [summary, setSummary] = useState(null);

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAgentWalletReport = async () => {
    try {
      const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
      const pageSize = isNaN(queryParams.pageSize)
        ? DEFAULT_PER_PAGE_RECORD
        : +queryParams.pageSize;

      const params = {
        page: pageIndex + 1, // API uses 1-based pagination
        limit: pageSize
      };

      // Add filters
      if (queryParams.agentName) {
        params.agentName = queryParams.agentName;
      }
      if (queryParams.agentID) {
        params.agentID = queryParams.agentID;
      }

      const result = await B2BAgentWalletService.getAgentWalletReport(params);

      if (result.status === 200) {
        const responseData = result.response;

        // Store summary data
        setSummary(responseData.summary);

        return {
          status: 200,
          data: responseMapper(responseData.data || []),
          totalRecords: parseInt(responseData.totalRecord || 0)
        };
      }

      return { status: result.status, error: result.error || 'Failed to fetch data' };
    } catch (error) {
      console.error('Error fetching agent wallet report:', error);
      return { status: 500, error: 'An error occurred while fetching the report' };
    }
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: agentWalletColumns,
    fetchData: fetchAgentWalletReport,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['agentId'], right: [] },
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

    setColumnFilters(filtersFromQuery);
  }, [queryParams, setColumnFilters]);

  const applyFilterHandler = () => {
    const filterItems = {};

    for (let data of table.getState().columnFilters) {
      if (data.id === 'agentName') {
        filterItems.agentName = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.agentName && { agentName: filterItems.agentName })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PER_PAGE_RECORD
      });
    }
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
