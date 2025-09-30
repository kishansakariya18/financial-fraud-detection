import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import { columns } from './columns.jsx';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import AgentService from 'services/agent.services';
import { commissionSummaryResponseMapper, redeemStatusToAPI } from './helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

export default function CommissionSummaryList({
  agentUID = null,
  breadcrumbs = null,
  pageTitle = null
}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultPageTitle = pageTitle || t('commission_summary');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchCommissionSummary = useCallback(async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const requestParams = {
      page: pageIndex + 1,
      perPage: pageSize,
      ...(agentUID && { callingAgentUID: agentUID }),
      ...(queryParams.targetName && { targetName: queryParams.targetName }),
      ...(queryParams.eventName && { eventName: queryParams.eventName }),
      ...(queryParams.startDate && { startDate: queryParams.startDate }),
      ...(queryParams.endDate && { endDate: queryParams.endDate }),
      ...(queryParams.isRedeemed && { isRedeemed: redeemStatusToAPI(queryParams.isRedeemed) })
    };

    return AgentService.getAgentSummary(requestParams)
      .then(({ response }) => {
        return {
          status: 200,
          data: commissionSummaryResponseMapper(response.data),
          totalRecords: response.totalRecords || 0
        };
      })
      .catch((error) => {
        toast.error(error || 'Failed to fetch commission summary');
        return { status: 500, error: error || 'Failed to fetch commission summary' };
      });
  }, [queryParams, agentUID]);

  const { table, isLoading, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchCommissionSummary,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {}
    }
  });

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.targetName) {
      filtersFromQuery.push({ id: 'targetName', value: queryParams.targetName });
    }
    if (queryParams.eventName) {
      filtersFromQuery.push({ id: 'eventName', value: queryParams.eventName });
    }
    if (queryParams.isRedeemed) {
      filtersFromQuery.push({ id: 'isRedeemed', value: queryParams.isRedeemed });
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
      if (data.id === 'targetName') {
        filterItems.targetName = data.value;
      }
      if (data.id === 'eventName') {
        filterItems.eventName = data.value;
      }
      if (data.id === 'isRedeemed') {
        filterItems.isRedeemed = data.value;
      }
      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.targetName && { targetName: filterItems.targetName }),
      ...(filterItems.eventName && { eventName: filterItems.eventName }),
      ...(filterItems.isRedeemed && { isRedeemed: filterItems.isRedeemed }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems.date[1] })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
  };

  // Enhance table with refresh callback for actions
  const enhancedTable = useMemo(() => {
    const actionsColumn = table.getAllColumns().find((col) => col.id === 'actions');
    if (actionsColumn) {
      const originalCell = actionsColumn.columnDef.cell;
      actionsColumn.columnDef.cell = (props) =>
        originalCell({
          ...props,
          onRefresh: () => table.options.meta.fetchNewList(true)
        });
    }
    return table;
  }, [table]);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={defaultPageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        table={table}
        pageTitle={defaultPageTitle}
        breadcrumbs={breadcrumbs}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={enhancedTable} loading={isLoading} />
    </ContentWrapper>
  );
}
