import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Toolbar } from './Toolbar';
import { columns } from './columns';
import AgentService from 'services/agent.services';
import { commissionEventsResponseMapper } from './helper';
import useTable from 'components/ui/useTable';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams } from 'utils/custom.utilities';
import TableCard from 'components/ui/custom/TableCard';
import { toast } from 'sonner';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

export default function CommissionEventsList({
  playerUID = null,
  agentUID = null,
  summaryData = null,
  breadcrumbs = null,
  pageTitle = null,
  hideDateFilter = false,
  hideFilters = false,
  hideEventNameColumn = false
}) {
  const { t } = useTranslation();
  const { playerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  // Use playerUID prop or extract from URL params
  const targetPlayerUID = playerUID || playerId;

  // Filter columns based on props
  const filteredColumns = useMemo(() => {
    return columns.filter((column) => {
      if (hideEventNameColumn && column.id === 'eventName') {
        return false;
      }
      return true;
    });
  }, [hideEventNameColumn]);

  const fetchCommissionEvents = useCallback(
    async ({ pageIndex = 0, pageSize = 10 }) => {
      const requestParams = {
        page: pageIndex + 1,
        perPage: pageSize,
        ...(agentUID && { callingAgentUID: agentUID }),
        // Pass dates at root level for proper handling
        ...(targetPlayerUID && { playerUID: targetPlayerUID }),
        ...(queryParams.eventName && { eventType: queryParams.eventName }),
        ...(queryParams.startDate && { startDate: queryParams.startDate }),
        ...(queryParams.endDate && { endDate: queryParams.endDate }),
        // Add summary-specific filters
        ...(summaryData && {
          eventType: summaryData.eventName,
          startDate: new Date(summaryData.periodStart).getTime(),
          endDate: new Date(summaryData.periodEnd).getTime()
        })
      };

      const result = await AgentService.getCommissionEvents(requestParams);
      return commissionEventsResponseMapper(result.response);
    },
    [
      agentUID,
      targetPlayerUID,
      queryParams.eventName,
      queryParams.startDate,
      queryParams.endDate,
      summaryData
    ]
  );

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: filteredColumns,
    fetchData: fetchCommissionEvents,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'] },
      tableSettings: {}
    }
  });

  // Set initial column filters from query params or summary data
  useEffect(() => {
    const columnFilters = [];

    // If we have summary data, use its filters
    if (summaryData) {
      columnFilters.push({
        id: 'eventName',
        value: summaryData.eventName
      });

      if (!hideDateFilter) {
        columnFilters.push({
          id: 'eventDate',
          value: [
            new Date(summaryData.periodStart).getTime(),
            new Date(summaryData.periodEnd).getTime()
          ]
        });
      }
    } else {
      // Use query params for normal filtering
      if (queryParams.eventName) {
        columnFilters.push({
          id: 'eventName',
          value: queryParams.eventName
        });
      }

      if (queryParams.startDate && queryParams.endDate && !hideDateFilter) {
        columnFilters.push({
          id: 'eventDate',
          value: [+queryParams.startDate, +queryParams.endDate]
        });
      }
    }

    if (columnFilters.length > 0) {
      setColumnFilters(columnFilters);
    }
  }, [queryParams, setColumnFilters, summaryData, hideDateFilter]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'eventName') {
        filterItems.eventName = data.value;
      }

      if (data.id === 'eventDate') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.eventName && { eventName: filterItems.eventName }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems.date[1] })
    });
  };

  const clearFilterHandler = () => {
    const newSearchParams = new URLSearchParams();

    // Preserve existing params not related to filters
    for (const [key, value] of searchParams.entries()) {
      if (!['eventName', 'startDate', 'endDate'].includes(key)) {
        newSearchParams.set(key, value);
      }
    }

    setSearchParams(newSearchParams);
    table.resetColumnFilters();
  };

  const defaultPageTitle = pageTitle || t('commission_events');

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, isLoading, setError]);

  return (
    <ContentWrapper pageTitle={defaultPageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      {!hideFilters && (
        <Toolbar
          table={table}
          pageTitle={defaultPageTitle}
          breadcrumbs={breadcrumbs}
          onApplyFilters={applyFilterHandler}
          onClearFilters={clearFilterHandler}
          hideDateFilter={hideDateFilter}
          summaryData={summaryData}
        />
      )}
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
