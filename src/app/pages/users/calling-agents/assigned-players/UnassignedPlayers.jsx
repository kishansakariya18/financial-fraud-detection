import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI,Services,Helper,Utils
import { playerColumns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import AgentService from 'services/agent.services';
import { PlayerFilters } from './PlayerFilters';
import { Button, Circlebar } from 'components/ui';
import { unassignedPlayersResponseMapper } from 'components/sections/assigned-players/helper';

export default function UnassignedPlayersList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { agentUID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('unassigned') + ' ' + t('players');
  const [checked, setChecked] = useState([]);
  const handleCheck = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const columns = playerColumns({ selectedIds: checked, handleCheck, actionLabel: 'Assign' });
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchUnassignedPlayers = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await AgentService.getUnassignedPlayerList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: unassignedPlayersResponseMapper(result.response?.data || []),
        totalRecords:
          parseInt(result.response.totalRecords || result.response.total_records || 0, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns,
    fetchData: fetchUnassignedPlayers,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { right: ['actions'] },
      tableSettings: {}
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
    if (queryParams.search) {
      filtersFromQuery.push({ id: 'username', value: queryParams.search });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};

    for (let data of table.getState().columnFilters) {
      if (data.id === 'username') {
        filterItems.search = data.value;
      }
    }

    setSearchParams({
      ...queryParams,
      pageIndex: 0,
      pageSize: 10,
      ...(filterItems.search && { search: filterItems.search })
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
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async () => {
    setSubmitLoading(true);
    const result = await AgentService.assignPlayersToAgent(agentUID, checked);

    if (result.status === 200 || result.status === 201) {
      setSubmitResponse(result.response.message);
      navigate(`/calling-agents/list/${agentUID}/tab/assigned-players`);
    } else {
      setSubmitError(result.error);
    }
    setSubmitLoading(false);
  };

  if (!submitLoading && !submitError && submitResponse) {
    toast.success(submitResponse);
    setSubmitResponse(null);
  }
  if (!submitLoading && submitError) {
    toast.error(submitError);
    setSubmitError(null);
  }

  const breadcrumbItem = [
    { title: t('calling_agents'), path: '/calling-agents/list' },
    {
      title: t('assigned') + ' ' + t('players'),
      path: `/calling-agents/list/${agentUID}/tab/assigned-players`
    },
    { title: t('add') + ' ' + t('players') }
  ];

  const bulkActions = (
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      {!submitLoading && (
        <Button
          type="button"
          color="primary"
          disabled={checked.length === 0}
          onClick={onSubmit}
          className="whitespace-nowrap">
          {t('assign') + ' ' + t('selected') + ' ' + t('players')}
        </Button>
      )}
      {submitLoading && <Circlebar size={6} strokeWidth={6} color="primary" isIndeterminate />}
    </div>
  );

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <PlayerFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        breadcrumbItem={breadcrumbItem}
        bulkActions={bulkActions}
      />

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
