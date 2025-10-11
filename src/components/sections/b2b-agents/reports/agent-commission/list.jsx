// Import Dependencies
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

// Local Imports
import { useLockScrollbar } from 'hooks';
import { AgentCommissionFilters } from './Filters';
import { AgentCommissionSummaryCard } from './SummaryCard';
import { responseMapper } from './helper';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import useTable from 'components/ui/useTable';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { agentCommissionColumns } from './columns';
import { useCurrencyContext } from 'app/contexts/currency/context';
import moment from 'moment-timezone';

// ----------------------------------------------------------------------

export default function AgentCommissionList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('Agent Commission Report');
  const [summary, setSummary] = useState(null);
  const { formatCurrency } = useCurrencyContext();

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAgentCommissionReport = async () => {
    try {
      const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
      const pageSize = isNaN(queryParams.pageSize)
        ? DEFAULT_PER_PAGE_RECORD
        : +queryParams.pageSize;

      const params = {
        page: pageIndex + 1, // API uses 1-based pagination
        limit: pageSize,
        ...(queryParams.agentName && { agentName: queryParams.agentName }),
        ...(queryParams.commissionType && { commissionType: queryParams.commissionType })
      };

      // Add filters
      if (queryParams.startDate) {
        params.startDate = moment(Number(queryParams.startDate)).startOf('day').toDate();
      }
      if (queryParams.endDate) {
        params.endDate = moment(Number(queryParams.endDate)).endOf('day').toDate();
      }
      if (queryParams.agentName) {
        params.agentName = queryParams.agentName;
      }

      const result = await B2BAgentWalletService.getAgentCommissionReport(params);

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
      console.error('Error fetching agent commission report:', error);
      return { status: 500, error: 'An error occurred while fetching the report' };
    }
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: agentCommissionColumns(formatCurrency),
    fetchData: fetchAgentCommissionReport,
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
    if (queryParams.commissionType) {
      filtersFromQuery.push({ id: 'commissionType', value: queryParams.commissionType });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'dateCreated',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }

    setColumnFilters(filtersFromQuery);
  }, [queryParams, setColumnFilters]);

  const applyFilterHandler = () => {
    const filterItems = {};

    for (let data of table.getState().columnFilters) {
      console.log(data);
      if (data.id === 'agentName') {
        filterItems.agentName = data.value;
      }
      if (data.id === 'commissionType') {
        filterItems.commissionType = data.value;
      }
      if (data.id === 'dateCreated') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.agentName && { agentName: filterItems.agentName }),
      ...(filterItems.commissionType && { commissionType: filterItems.commissionType }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems.date[1] })
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
      <AgentCommissionSummaryCard summary={summary} loading={isLoading} />
      <AgentCommissionFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
