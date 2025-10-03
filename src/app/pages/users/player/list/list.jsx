import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// Local Imports - UI, Services, Helpers, Utils

import PlayerService from 'services/player.services';
import UserClassService from 'services/user-class.services';
import { useTranslation } from 'react-i18next';
import PlayerList from 'components/sections/player-management/player-list/PlayerList';

export default function Player() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageTitle = t('player') + ' ' + t('list');
  const [summary, setSummary] = useState(null);
  const [countries, setCountries] = useState(null);
  const [segmentations, setSegmentations] = useState(null);
  const [playerClasses, setPlayerClasses] = useState([]);

  const fetchPlayers = async (requestObject) => {
    return PlayerService.playerList(requestObject)
      .then(({ status, response }) => {
        if (status === 200) {
          return { data: response.data, status: 'success' };
        }
        return { error: response.error, status: 'error' };
      })
      .catch((error) => {
        return { error: error, status: 'error' };
      });
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
  const fetchPlayerClasses = async () => {
    const result = await UserClassService.userclassAllList();
    if (result?.status === 200) {
      const dataArr = result?.response?.data || result?.response?.Data || [];
      const options = Array.isArray(dataArr)
        ? dataArr.map((cls) => ({
            label: cls?.ClassName || cls?.title || cls?.Name || `Class ${cls?.UserClassID || ''}`,
            value: cls?.UserClassID || cls?.id || cls?.UserClassId
          }))
        : [];
      setPlayerClasses(options.filter((i) => i.value != null));
    }
    return { status: result?.status, error: result?.error };
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

  const handleView = (player) => {
    navigate(`/users/player/${player.userUID}/${player.userID}/tab/details`);
  };

  const handleChangePlayerStatus = async (player) => {
    return await PlayerService.changePlayerStatus(player.userUID);
  };

  useEffect(() => {
    fetchSummary();
    fetchCountryList();
    fetchSegmentationList();
    fetchPlayerClasses();
  }, []);
  // const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
  //   columns,
  //   fetchData: fetchPlayers,
  //   queryParams,
  //   fetchSummary: fetchSummary,
  //   setSearchParams,
  //   initialSettings: {
  //     columnPinning: { left: ['id'], right: ['actions'] },
  //     tableSettings: {},
  //     columnVisibility: {
  //       userUID: false,
  //       CountryID: false,
  //       isKYCVerified: false,
  //       isBankVerified: false,
  //       segmentationID: false,
  //       playerClassID: false
  //     }
  //   }
  // });

  // useEffect(() => {
  //   if (!isLoading && error) {
  //     toast.error(error);
  //     setError('');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [error]);

  // useEffect(() => {
  //   if (!filtersInitializedRef.current) {
  //     const filtersFromQuery = [];
  //     if (queryParams.keyword) {
  //       filtersFromQuery.push({ id: 'username', value: queryParams.keyword });
  //     }
  //     if (queryParams.status) {
  //       filtersFromQuery.push({ id: 'status', value: queryParams.status });
  //     }
  //     if (queryParams.isKYCVerified) {
  //       filtersFromQuery.push({ id: 'isKYCVerified', value: queryParams.isKYCVerified });
  //     }
  //     if (queryParams.isBankVerified) {
  //       filtersFromQuery.push({ id: 'isBankVerified', value: queryParams.isBankVerified });
  //     }
  //     if (queryParams.CountryID) {
  //       let countryIds = queryParams.CountryID;
  //       if (typeof countryIds === 'string') {
  //         countryIds = countryIds.split(',').filter(Boolean);
  //       }
  //       if (!Array.isArray(countryIds)) {
  //         countryIds = [countryIds];
  //       }
  //       filtersFromQuery.push({ id: 'CountryID', value: countryIds });
  //     }
  //     if (queryParams.SegmentationID) {
  //       let segmentationIds = queryParams.SegmentationID;
  //       if (typeof segmentationIds === 'string') {
  //         segmentationIds = segmentationIds.split(',').filter(Boolean);
  //       }
  //       if (!Array.isArray(segmentationIds)) {
  //         segmentationIds = [segmentationIds];
  //       }
  //       filtersFromQuery.push({ id: 'SegmentationID', value: segmentationIds });
  //     }
  //     if (queryParams.gender) {
  //       filtersFromQuery.push({ id: 'gender', value: queryParams.gender });
  //     }
  //     if (queryParams.playerClassID) {
  //       filtersFromQuery.push({ id: 'playerClassID', value: queryParams.playerClassID });
  //     }
  //     if (queryParams.startDate && queryParams.endDate) {
  //       filtersFromQuery.push({
  //         id: 'createdAt',
  //         value: [+queryParams.startDate, +queryParams.endDate]
  //       });
  //     }
  //     setColumnFilters(filtersFromQuery);
  //     filtersInitializedRef.current = true;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [queryParams]);

  // const applyFilterHandler = () => {
  //   const filterItems = {};
  //   for (let data of table.getState().columnFilters) {
  //     if (data.id === 'username') {
  //       filterItems.keyword = data.value;
  //     }
  //     if (data.id === 'status') {
  //       filterItems.status = data.value;
  //     }
  //     if (data.id === 'isKYCVerified') {
  //       filterItems.isKYCVerified = data.value;
  //     }
  //     if (data.id === 'isBankVerified') {
  //       filterItems.isBankVerified = data.value;
  //     }
  //     if (data.id === 'CountryID') {
  //       filterItems.CountryID = data.value;
  //     }
  //     if (data.id === 'SegmentationID') {
  //       filterItems.SegmentationID = data.value;
  //     }
  //     if (data.id === 'createdAt') {
  //       filterItems.date = data.value;
  //     }
  //     if (data.id === 'gender') {
  //       filterItems.gender = data.value;
  //     }
  //     if (data.id === 'playerClassID') {
  //       filterItems.playerClassID = data.value;
  //     }
  //   }

  //   const countryIds = filterItems.CountryID
  //     ? Array.isArray(filterItems.CountryID)
  //       ? filterItems.CountryID
  //       : [filterItems.CountryID]
  //     : [];
  //   const segmentationIds = filterItems.SegmentationID
  //     ? Array.isArray(filterItems.SegmentationID)
  //       ? filterItems.SegmentationID
  //       : [filterItems.SegmentationID]
  //     : [];

  //   setSearchParams({
  //     pageIndex: DEFAULT_PAGE_INDEX,
  //     pageSize: DEFAULT_PER_PAGE_RECORD,
  //     ...(filterItems.keyword && { keyword: filterItems.keyword }),
  //     ...(filterItems.status && { status: filterItems.status }),
  //     ...(filterItems.isBankVerified && { isBankVerified: filterItems.isBankVerified }),
  //     ...(filterItems.isKYCVerified && { isKYCVerified: filterItems.isKYCVerified }),
  //     ...(countryIds.length && { CountryID: countryIds.join(',') }),
  //     ...(segmentationIds.length && { SegmentationID: segmentationIds.join(',') }),
  //     ...(filterItems.date && { startDate: filterItems.date[0] }),
  //     ...(filterItems.date && { endDate: filterItems?.date[1] }),
  //     ...(filterItems.gender && { gender: filterItems.gender }),
  //     ...(filterItems.playerClassID && { playerClassID: filterItems.playerClassID })
  //   });
  //   // Do NOT reset filtersInitializedRef here, so UI state is preserved
  // };

  // const clearFilterHandler = () => {
  //   if (!isEmptyObject(queryParams)) {
  //     setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
  //   }
  //   table.resetColumnFilters();
  //   filtersInitializedRef.current = false; // Allow re-initialization from URL
  // };

  // useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <PlayerList
      pageTitle={pageTitle}
      onView={handleView}
      onChangeStatus={handleChangePlayerStatus}
      listFor="admin"
      getPlayerList={fetchPlayers}
      countries={countries}
      segmentations={segmentations}
      playerClasses={playerClasses}
      summary={summary}
      onFetchSummary={fetchSummary}
    />
  );

  // return (
  //   <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
  //     <Toolbar
  //       table={table}
  //       summary={summary}
  //       countries={countries}
  //       segmentations={segmentations}
  //       playerClasses={playerClasses}
  //       pageTitle={pageTitle}
  //       onApplyFilters={applyFilterHandler}
  //       onClearFilters={clearFilterHandler}
  //     />
  //     <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
  //   </ContentWrapper>
  // );
}
