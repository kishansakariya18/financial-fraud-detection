import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import EventTemplateService from 'services/event-template.services';
import { emailtemplateListResponseMapper } from '../helper';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

export default function EmailTemplates() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('eventTemplate') + ' ' + t('list');
  const [loading, setLoading] = useState(false);
  const [eventGroupList, setEventGroupList] = useState([]);
  const [channelList, setChannelList] = useState([]);

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { hasPermission } = usePermissions();
  const canShowActions =
    hasPermission(PERMISSIONS.EVENT_TEMPLATE.EDIT) ||
    hasPermission(PERMISSIONS.EVENT_TEMPLATE.CHANGE_STATUS);

  const fetchEmailTemplate = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await EventTemplateService.eventTemplateList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    const apiData = emailtemplateListResponseMapper(result.response);

    if (result.status === 200) {
      return {
        status: 200,
        data: apiData.list,
        totalRecords: parseInt(result?.response?.totalRecords) || DEFAULT_PER_PAGE_RECORD
      };
    }
    return { status: result.status, error: result.error };
  };

  const getEventMasterList = async () => {
    setLoading(true);
    setError(null);
    const result = await EventTemplateService.getTemplateData();
    if (result) {
      if (result.status === 200 || result.status === 201) {
        const channels =
          result?.response?.data?.channels.map((item) => ({
            key: item.ChannelID,
            value: item.ChannelCode,
            label: item.ChannelCode
          })) || [];

        const groupList = result.response.data?.groups || [];
        setEventGroupList(
          groupList?.map((item) => ({
            key: item.EventGroupID,
            value: item.EventGroupID,
            label: item.EventGroupCategory
          }))
        );
        setChannelList(channels);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getEventMasterList();
  }, []);

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns({ canShowActions }),
    fetchData: fetchEmailTemplate,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: canShowActions ? ['actions'] : [] },
      tableSettings: { enableFullScreen: false },
      columnVisibility: { slug: false }
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
      filtersFromQuery.push({ id: 'title', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }
    if (queryParams.eventGroupId) {
      filtersFromQuery.push({ id: 'eventGroup', value: queryParams.eventGroupId });
    }
    if (queryParams.channelCode) {
      filtersFromQuery.push({ id: 'channelCode', value: queryParams.channelCode });
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
      if (data.id === 'title') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
      if (data.id === 'eventGroup') {
        filterItems.eventGroupId = data.value;
      }
      if (data.id === 'channelCode') {
        filterItems.channelCode = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] }),
      ...(filterItems.eventGroupId && { eventGroupId: filterItems.eventGroupId }),
      ...(filterItems.channelCode && { channelCode: filterItems.channelCode })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        table={table}
        pageTitle={pageTitle}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        eventGroupOptions={eventGroupList}
        channelOptions={channelList}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading || loading} />
    </ContentWrapper>
  );
}
