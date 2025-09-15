import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';
import { useSelector } from 'react-redux';

// Local Imports - UI,Services,Helper,Utils
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import AgentService from 'services/agent.services';
import { Button } from 'components/ui';
import { ADMIN_TYPE } from 'constants/app.constant';
import { assignedPlayersColumns } from './columns.jsx';
import { AssignedPlayersFilters } from './AssignedPlayersFilters.jsx';
import { unassignedPlayersResponseMapper } from './helper.js';

export default function AssignedPlayersList({
  pageTitle,
  breadcrumbItems = [],
  enableAssignUnassign = false
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { agentUID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const userData = useSelector((state) => state.auth.userData);

  // Determine if assign/unassign should be enabled
  const canAssignUnassign = enableAssignUnassign && userData?.AdminType === ADMIN_TYPE.ADMIN;

  const [checked, setChecked] = useState([]);
  const handleCheck = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const callingAgentUID = useMemo(
    () => (userData?.AdminType === ADMIN_TYPE.AGENT ? userData?.AdminUID : agentUID),
    [userData, agentUID]
  );

  const defaultPageTitle = pageTitle || t('assigned') + ' ' + t('players');
  const columns = assignedPlayersColumns({
    selectedIds: checked,
    handleCheck,
    actionLabel: 'Unassign',
    showActions: canAssignUnassign,
    userType: userData?.AdminType,
    callingAgentUID,
    navigate
  });

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAssignedPlayers = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;

    const result = await AgentService.getAgentPlayerList(callingAgentUID, {
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
    fetchData: fetchAssignedPlayers,
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
  const [submitLoading, setSubmitLoading] = useState(false);

  const onSubmit = async () => {
    if (!canAssignUnassign) return;

    setSubmitLoading(true);
    const targetAgentUID = userData?.AdminType ? userData?.id || userData?.agentUID : agentUID;
    AgentService.unassignPlayersFromAgent(targetAgentUID, checked)
      .then((result) => {
        console.log('Unassign players result:', result.response);
        toast.success(result.response.message);
        setChecked([]);
        table.options.meta?.fetchNewList(true);
      })
      .catch((error) => {
        console.error('Error unassigning players:', error);
        toast.error(error || error?.message || 'Failed to unassign players');
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  const handleAddPlayers = () => {
    navigate(`/calling-agents/list/${agentUID}/unassigned-players`);
  };

  const bulkActions = canAssignUnassign && (
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      <Button
        type="button"
        color="primary"
        disabled={checked.length === 0 || submitLoading}
        onClick={onSubmit}
        className="h-8 whitespace-nowrap px-3 text-xs">
        {t('unassign') + ' ' + t('selected')}
      </Button>
    </div>
  );

  return (
    <ContentWrapper pageTitle={defaultPageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <AssignedPlayersFilters
        pageTitle={defaultPageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        breadcrumbItem={breadcrumbItems}
        onAddPlayers={handleAddPlayers}
        canAddPlayers={canAssignUnassign}
        bulkActions={bulkActions}
      />

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
