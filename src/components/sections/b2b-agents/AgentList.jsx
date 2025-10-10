import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { responseMapper } from 'components/sections/b2b-agents/helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import PropTypes from 'prop-types';
import { AgentToolbar, createAgentColumns } from '.';

export default function AgentList({
  onFetchAgents,
  onChangeAgentStatus,
  onViewAgent,
  onEditAgent,
  onAddAgent,
  pageTitle,
  showAgentTypeFilter = true,
  showDateFilter = true,
  showStatusFilter = true,
  showAddButton = true,
  columnVisibility = {},
  breadcrumbs = null
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => {
    return getQueryParams(searchParams);
  }, [searchParams]);

  const columns = useMemo(() => {
    return createAgentColumns({
      showAgentType: showAgentTypeFilter,
      onViewAgent,
      onEditAgent,
      onChangeAgentStatus
    });
  }, [showAgentTypeFilter, onViewAgent, onEditAgent, onChangeAgentStatus]);

  const fetchAgents = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    let response = {};
    try {
      const result = await onFetchAgents({
        pagination: { pageIndex, pageSize },
        filters: { ...queryParams }
      });
      if (result.status === 200) {
        response = {
          status: 200,
          data: responseMapper(result.response.data),
          totalRecords: result.response.totalRecords || 0
        };
      }
    } catch (error) {
      response = { status: 500, error: error.message };
    }

    console.log('response: ', response);
    return response;
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchAgents,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {},
      columnVisibility: {
        firstname: false,
        lastname: false,
        agentUID: false,
        ...columnVisibility
      }
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
    if (queryParams.status && showStatusFilter) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }
    if (queryParams.agentType && showAgentTypeFilter) {
      filtersFromQuery.push({ id: 'agentType', value: queryParams.agentType });
    }
    if (queryParams.startDate && queryParams.endDate && showDateFilter) {
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

      if (data.id === 'status' && showStatusFilter) {
        filterItems.status = data.value;
      }

      if (data.id === 'agentType' && showAgentTypeFilter) {
        filterItems.agentType = data.value;
      }

      if (data.id === 'createdAt' && showDateFilter) {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.agentType && { agentType: filterItems.agentType }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({
        pageIndex: 0,
        pageSize: 10
      });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <AgentToolbar
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        onAddAgent={onAddAgent}
        showAddButton={showAddButton}
        showAgentTypeFilter={showAgentTypeFilter}
        showDateFilter={showDateFilter}
        showStatusFilter={showStatusFilter}
        breadcrumbs={breadcrumbs}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}

AgentList.propTypes = {
  onFetchAgents: PropTypes.func.isRequired,
  onChangeAgentStatus: PropTypes.func.isRequired,
  onViewAgent: PropTypes.func.isRequired,
  onEditAgent: PropTypes.func.isRequired,
  onAddAgent: PropTypes.func,
  pageTitle: PropTypes.string.isRequired,
  showAgentTypeFilter: PropTypes.bool,
  showDateFilter: PropTypes.bool,
  showStatusFilter: PropTypes.bool,
  showAddButton: PropTypes.bool,
  columnVisibility: PropTypes.object,
  breadcrumbs: PropTypes.array
};
