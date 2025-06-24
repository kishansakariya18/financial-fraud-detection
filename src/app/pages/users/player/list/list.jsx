import { useEffect, useMemo, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import PlayerService from 'services/player.services';
import { responseMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

export default function Player() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('player') + ' ' + t('list');
  const [summary, setSummary] = useState(null);
  const [countries, setCountries] = useState(null);
  const [segmentations, setSegmentations] = useState(null);
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const filtersInitializedRef = useRef(false);

  const fetchPlayers = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await PlayerService.playerList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: responseMapper(result.response.data),
        totalRecords: parseInt(result?.response?.totalRecords) || DEFAULT_PER_PAGE_RECORD
      };
    }
    return { status: result.status, error: result.error };
  };
  const fetchCountryList = async () => {
    const result = await PlayerService.countryList();
    if (result.status === 200) {
      setCountries(result.response.data);
    }
    return { status: result.status, error: result.error };
  };
  const fetchSegmentationList = async () => {
    const result = await PlayerService.segmentationList();
    if (result.status === 200) {
      setSegmentations(result.response.data);
    }
    return { status: result.status, error: result.error };
  };
  const fetchSummary = async () => {
    // setError(null);

    const result = await PlayerService.userSummary();

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
    fetchCountryList();
    fetchSegmentationList();
  }, []);
  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchPlayers,
    queryParams,
    fetchSummary: fetchSummary,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {},
      columnVisibility: { userUID: false }
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
      ...(filterItems.date && { endDate: filterItems?.date[1] })
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
        pageTitle={pageTitle}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
