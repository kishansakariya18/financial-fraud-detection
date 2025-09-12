import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams, useParams } from 'react-router';
import { useLockScrollbar } from 'hooks';
import { useTranslation } from 'react-i18next';

import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import useTable from 'components/ui/useTable';
import AgentService from 'services/agent.services';

import { columns } from './columns';
import { Toolbar } from './Toolbar';
import ActionModal from './ActionModal';
import { responseMapper } from './helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';

export default function RedeemRequests() {
  const { t } = useTranslation();
  const { agentUID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('commission_redeem_requests');

  const [actionModal, setActionModal] = useState({ open: false, type: null, request: null });
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchRedeemRequests = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;

    const result = await AgentService.getRedeemRequests({
      pagination: { pageIndex, pageSize },
      agentUID,
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: responseMapper(result.response.data || []),
        totalRecords: parseInt(result.response.totalRecords || 0, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns({
      onApprove: handleApprove,
      onReject: handleReject,
      onSettle: handleSettle
    }),
    fetchData: fetchRedeemRequests,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {}
    }
  });

  function handleApprove(request) {
    setActionModal({ open: true, type: 'approve', request });
  }

  function handleReject(request) {
    setActionModal({ open: true, type: 'reject', request });
  }

  function handleSettle(request) {
    setActionModal({ open: true, type: 'settle', request });
  }

  const handleActionSubmit = async (data) => {
    await AgentService.updateRedeemRequestStatus(actionModal.request.id, data)
      .then((result) => {
        setActionModal({ open: false, type: null, request: null });
        toast.success(result.response.message);
        table.options.meta?.fetchNewList(true);
      })
      .catch((error) => {
        toast.error(error || `Failed to ${actionModal.type} request`);
      });
  };

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
      filtersFromQuery.push({ id: 'remarks', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'requestedAt',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'remarks') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
      if (data.id === 'requestedAt') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: 0,
      pageSize: 10,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems.date[1] })
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
      <Toolbar
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />

      {actionModal.open && (
        <ActionModal
          show={actionModal.open}
          type={actionModal.type}
          request={actionModal.request}
          onClose={() => setActionModal({ open: false, type: null, request: null })}
          onSubmit={handleActionSubmit}
        />
      )}
    </ContentWrapper>
  );
}
