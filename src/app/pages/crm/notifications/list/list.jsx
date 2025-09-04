import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';
import { useTranslation } from 'react-i18next';

import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import useTable from 'components/ui/useTable';

import { NotificationFilters } from './NotificationFilters';
import { columns } from './columns';
import CRMService from 'services/crm.services';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { parseNotificationStatusToApi, parseTypeToApp } from 'app/pages/crm/helper';
import { getDateInUTCToTimeZone } from 'helpers/functions';

function responseMapper(apiData) {
  const list =
    apiData?.map((item, idx) => ({
      id: item?.NotificationLogID || idx + 1,
      NotificationLogID: item?.NotificationLogID || '-',
      Title: item?.Title || '-',
      MsgBody: item?.MsgBody || '-',
      RecipientGroupType: item?.RecipientGroupType || '-',
      Status: parseNotificationStatusToApi(item?.Status),
      DateCreated: getDateInUTCToTimeZone(
        item?.DateCreated || '-',
        undefined,
        'DD MMM YYYY, hh:mm A'
      ),
      DateModified: getDateInUTCToTimeZone(
        item?.DateModified || '-',
        undefined,
        'DD MMM YYYY, hh:mm A'
      ),
      Type: parseTypeToApp(item?.Type),
      // numeric timestamp for filtering (hidden column)
      createdAt: item?.DateCreated ? new Date(item.DateCreated).getTime() : null,
      Channel: item?.Channel
    })) || [];
  console.log(list[0].Status);
  return list;
}

export default function NotificationList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('crm_notifications') || 'Notification List';

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchNotifications = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await CRMService.getNotificationsList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result?.status === 200) {
      return {
        status: 200,
        data: responseMapper(result.response?.data),
        totalRecords: parseInt(result.response?.totalRecords, 10) || 0
      };
    }

    return {
      status: result?.status || 500,
      error: result?.error || 'Failed to load notifications'
    };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchNotifications,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {},
      columnVisibility: { createdAt: false }
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
      filtersFromQuery.push({ id: 'Title', value: queryParams.keyword });
    }
    if (queryParams.channel) {
      filtersFromQuery.push({ id: 'Channel', value: queryParams.channel });
    }
    if (queryParams.type) {
      // FacedtedFilter expects an array for arrIncludesSome; but single-select works with string too
      filtersFromQuery.push({ id: 'Type', value: queryParams.type });
    }
    if (queryParams.startDate && queryParams.endDate) {
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
      if (data.id === 'Title') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'Channel') {
        filterItems.channel = data.value;
      }
      if (data.id === 'Type') {
        filterItems.type = data.value;
      }
      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: 0,
      pageSize: 10,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.channel && { channel: filterItems.channel }),
      ...(filterItems.type && { type: filterItems.type }),
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
      <NotificationFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
