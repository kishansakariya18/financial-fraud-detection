import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI,Services,Helper,Utils
import { ProviderFilters } from './gamesFilters';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { providerResponserMapper, responseMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import GamesService from 'services/games.services';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import ProviderService from 'services/provider.services';
import GameService from 'services/game.services';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

export default function Games() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('casino_games');
  const [summary, setSummary] = useState(null);
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const { hasPermission } = usePermissions();
  const canShowActions =
    hasPermission(PERMISSIONS.GAME.EDIT) ||
    hasPermission(PERMISSIONS.GAME.CHANGE_STATUS) ||
    hasPermission(PERMISSIONS.GAME.ADD_SEGMENTATION);

  const [providerOptions, setProviderOptions] = useState([]);

  const fetchAllProviders = async () => {
    const result = await ProviderService.getAllProviders();

    if (result.status === 200) {
      setProviderOptions(providerResponserMapper(result.response.data));
    }

    return { status: result.status, error: result.error };
  };

  // const getProviderValue = (providerId) => {
  //   const provider = providerOptions.find((p) => p.id === providerId);

  //   return provider?.value || null;
  // };

  useEffect(() => {
    fetchAllProviders();
  }, []);
  const fetchSummary = async () => {
    // setError(null);

    const result = await GameService.getGameSummary();

    if (result.status === 200) {
      setSummary(result.response.data);
      return {
        status: 200,
        data: result.response.data,
        totalRecords: parseInt(result.response.total_records, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };
  useEffect(() => {
    fetchSummary();
  }, []);
  const fetchProvider = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const result = await GamesService.getGamesList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: responseMapper(result.response.data),
        totalRecords: parseInt(result.response.totalRecords, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns({ canShowActions }),
    fetchData: fetchProvider,
    queryParams,
    fetchSummary: fetchSummary,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: canShowActions ? ['actions'] : [] },
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
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'name', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }
    if (queryParams.provider) {
      filtersFromQuery.push({ id: 'provider', value: +queryParams.provider });
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
      if (data.id === 'name') {
        filterItems.keyword = data.value;
      }

      if (data.id === 'status') {
        filterItems.status = data.value;
      }

      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }

      if (data.id === 'provider') {
        filterItems.provider = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] }),
      ...(filterItems.provider && { provider: filterItems.provider })
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
  // console.log('tableSettings: from reports', table);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      {/* <Toolbar breadcrumbs={breadcrumbs} table={table} pageTitle={pageTitle} /> */}
      <ProviderFilters
        pageTitle={pageTitle}
        table={table}
        summary={summary}
        providerOptions={providerOptions}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        // filters= {}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
