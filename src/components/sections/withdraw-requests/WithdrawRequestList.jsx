import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { WithdrawRequestToolbar } from './WithdrawRequestToolbar';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { WithdrawRequestColumns } from './WithdrawRequestColumns';
import PropTypes from 'prop-types';
import { CustomModal } from 'components/custom';
import { useTranslation } from 'react-i18next';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import { StatusUpdateDialog } from '.';
import { transformWithdrawRequestData } from './helper';

export default function WithdrawRequestList({
  pageTitle,
  listFor = 'admin',
  getWithdrawRequestList,
  showFormEntityType = false,
  breadcrumbs = null,
  showActions = true
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { t } = useTranslation();
  const filtersInitializedRef = useRef(false);
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    requestData: null,
    status: null,
    loading: false
  });

  const handleUpdateStatus = (requestData, status) => {
    console.log('handleUpdateStatus called with:', requestData, status);
    setStatusDialog({
      isOpen: true,
      requestData,
      status,
      loading: false
    });
    console.log('StatusDialog state set to open');
  };

  const handleConfirmStatusUpdate = async (data) => {
    setStatusDialog((prev) => ({ ...prev, loading: true }));

    B2BAgentWalletService.updateWithdrawRequestStatus(data)
      .then(({ response }) => {
        toast.success(response.message);
        table.options.meta?.fetchNewList(true);
        setStatusDialog({ isOpen: false, requestData: null, status: null, loading: false });
      })
      .catch((error) => {
        toast.error(error || t('failed_to_update_request'));
        setStatusDialog((prev) => ({ ...prev, loading: false }));
      });
  };

  const fetchRequests = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await getWithdrawRequestList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    })
      .then(({ response }) => {
        return {
          status: 200,
          data: transformWithdrawRequestData(response?.data) || [],
          totalRecords: parseInt(response?.totalRecord) || DEFAULT_PER_PAGE_RECORD
        };
      })
      .catch((error) => {
        return {
          status: 500,
          error: error || t('failed_to_load_requests')
        };
      });
    return result;
  };

  const { table, isLoading, tableSettings, setColumnFilters } = useTable({
    columns: WithdrawRequestColumns({
      listFor,
      onUpdateStatus: handleUpdateStatus,
      showActions,
      showFormEntityType
    }),
    fetchData: fetchRequests,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {},
      columnVisibility: {}
    }
  });

  useEffect(() => {
    if (!filtersInitializedRef.current) {
      const filtersFromQuery = [];
      if (queryParams.status) {
        filtersFromQuery.push({ id: 'status', value: queryParams.status });
      }
      if (queryParams.entityType) {
        filtersFromQuery.push({ id: 'entityType', value: queryParams.entityType });
      }
      if (queryParams.formType) {
        filtersFromQuery.push({ id: 'formType', value: queryParams.formType });
      }
      setColumnFilters(filtersFromQuery);
      filtersInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      console.log('data', data);
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
      if (data.id === 'toEntityType') {
        filterItems.entityType = data.value;
      }
      if (data.id === 'fromEntityType') {
        filterItems.formType = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.entityType && { entityType: filterItems.entityType }),
      ...(filterItems.formType && { formType: filterItems.formType })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
    filtersInitializedRef.current = false;
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <WithdrawRequestToolbar
        table={table}
        listFor={listFor}
        pageTitle={pageTitle}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        breadcrumbs={breadcrumbs}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />

      <CustomModal
        show={!!statusDialog.isOpen}
        onClose={() =>
          setStatusDialog({ isOpen: false, requestData: null, status: null, loading: false })
        }
        title={t('confirm_action')}>
        <StatusUpdateDialog
          onClose={() =>
            setStatusDialog({ isOpen: false, requestData: null, status: null, loading: false })
          }
          onConfirm={handleConfirmStatusUpdate}
          requestData={statusDialog.requestData}
          status={statusDialog.status}
          loading={statusDialog.loading}
        />
      </CustomModal>
    </ContentWrapper>
  );
}

WithdrawRequestList.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  listFor: PropTypes.oneOf(['agent', 'admin']),
  getWithdrawRequestList: PropTypes.func.isRequired,
  breadcrumbs: PropTypes.array,
  showActions: PropTypes.bool
};
