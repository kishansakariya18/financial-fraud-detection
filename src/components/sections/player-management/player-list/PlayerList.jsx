import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { responseMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { PlayerColumns } from './PlayerColumns';
import PropTypes from 'prop-types';

export default function PlayerList({
  pageTitle,
  onView,
  onEdit,
  onChangeStatus,
  onCreditAmount = null,
  listFor = 'admin',
  getPlayerList,
  countries,
  segmentations,
  playerClasses,
  summary,
  onFetchSummary = null,
  onCreate = null,
  breadcrumbs = null,
  onResetPassword = null
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const filtersInitializedRef = useRef(false);

  const fetchPlayers = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await getPlayerList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 'success') {
      return {
        status: 200,
        data: responseMapper(result.data),
        totalRecords: parseInt(result?.totalRecords) || DEFAULT_PER_PAGE_RECORD
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: PlayerColumns({
      listFor,
      onView,
      onEdit,
      onChangeStatus,
      onCreditAmount,
      onResetPassword
    }),
    fetchData: fetchPlayers,
    queryParams,
    fetchSummary: onFetchSummary,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {},
      columnVisibility: {
        userUID: false,
        CountryID: false,
        isKYCVerified: false,
        isBankVerified: false,
        segmentationID: false,
        playerClassID: false
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
    if (!filtersInitializedRef.current) {
      const filtersFromQuery = [];
      if (queryParams.keyword) {
        filtersFromQuery.push({ id: 'username', value: queryParams.keyword });
      }
      if (queryParams.status) {
        filtersFromQuery.push({ id: 'status', value: queryParams.status });
      }
      if (queryParams.isKYCVerified) {
        filtersFromQuery.push({ id: 'isKYCVerified', value: queryParams.isKYCVerified });
      }
      if (queryParams.isBankVerified) {
        filtersFromQuery.push({ id: 'isBankVerified', value: queryParams.isBankVerified });
      }
      if (queryParams.CountryID) {
        let countryIds = queryParams.CountryID;
        if (typeof countryIds === 'string') {
          countryIds = countryIds.split(',').filter(Boolean);
        }
        if (!Array.isArray(countryIds)) {
          countryIds = [countryIds];
        }
        filtersFromQuery.push({ id: 'CountryID', value: countryIds });
      }
      if (queryParams.SegmentationID) {
        let segmentationIds = queryParams.SegmentationID;
        if (typeof segmentationIds === 'string') {
          segmentationIds = segmentationIds.split(',').filter(Boolean);
        }
        if (!Array.isArray(segmentationIds)) {
          segmentationIds = [segmentationIds];
        }
        filtersFromQuery.push({ id: 'SegmentationID', value: segmentationIds });
      }
      if (queryParams.gender) {
        filtersFromQuery.push({ id: 'gender', value: queryParams.gender });
      }
      if (queryParams.playerClassID) {
        filtersFromQuery.push({ id: 'playerClassID', value: queryParams.playerClassID });
      }
      if (queryParams.startDate && queryParams.endDate) {
        filtersFromQuery.push({
          id: 'createdAt',
          value: [+queryParams.startDate, +queryParams.endDate]
        });
      }
      setColumnFilters(filtersFromQuery);
      filtersInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'username') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
      if (data.id === 'isKYCVerified') {
        filterItems.isKYCVerified = data.value;
      }
      if (data.id === 'isBankVerified') {
        filterItems.isBankVerified = data.value;
      }
      if (data.id === 'CountryID') {
        filterItems.CountryID = data.value;
      }
      if (data.id === 'SegmentationID') {
        filterItems.SegmentationID = data.value;
      }
      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
      if (data.id === 'gender') {
        filterItems.gender = data.value;
      }
      if (data.id === 'playerClassID') {
        filterItems.playerClassID = data.value;
      }
    }

    const countryIds = filterItems.CountryID
      ? Array.isArray(filterItems.CountryID)
        ? filterItems.CountryID
        : [filterItems.CountryID]
      : [];
    const segmentationIds = filterItems.SegmentationID
      ? Array.isArray(filterItems.SegmentationID)
        ? filterItems.SegmentationID
        : [filterItems.SegmentationID]
      : [];

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.isBankVerified && { isBankVerified: filterItems.isBankVerified }),
      ...(filterItems.isKYCVerified && { isKYCVerified: filterItems.isKYCVerified }),
      ...(countryIds.length && { CountryID: countryIds.join(',') }),
      ...(segmentationIds.length && { SegmentationID: segmentationIds.join(',') }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] }),
      ...(filterItems.gender && { gender: filterItems.gender }),
      ...(filterItems.playerClassID && { playerClassID: filterItems.playerClassID })
    });
    // Do NOT reset filtersInitializedRef here, so UI state is preserved
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
    filtersInitializedRef.current = false; // Allow re-initialization from URL
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        table={table}
        summary={summary}
        countries={countries}
        segmentations={segmentations}
        playerClasses={playerClasses}
        pageTitle={pageTitle}
        onCreate={onCreate}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        breadcrumbs={breadcrumbs}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}

PlayerList.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onCreditAmount: PropTypes.func,
  listFor: PropTypes.oneOf(['agent', 'admin', 'calling-agent']),
  getPlayerList: PropTypes.func,
  countries: PropTypes.array,
  segmentations: PropTypes.array,
  playerClasses: PropTypes.array,
  summary: PropTypes.object,
  onFetchSummary: PropTypes.func,
  onCreate: PropTypes.func,
  onResetPassword: PropTypes.func
};
