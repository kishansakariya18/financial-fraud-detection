import { useEffect, useState } from 'react';

// Local Imports - UI, Services, Helpers, Utils

import PlayerService from 'services/users.services';
import UserClassService from 'services/user-class.services';
import { useTranslation } from 'react-i18next';
import PlayerList from 'components/sections/player-management/player-list/PlayerList';
import { useNavigate } from 'react-router';
import { isB2BPlatform } from 'utils/platformNavigation';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

export default function Player() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageTitle = t('player') + ' ' + t('list');
  const [summary, setSummary] = useState(null);
  const [countries, setCountries] = useState(null);
  const [segmentations, setSegmentations] = useState(null);
  const [playerClasses, setPlayerClasses] = useState([]);
  const isB2b = isB2BPlatform();
  const { hasPermission } = usePermissions();

  const fetchPlayers = async (filters) => {
    const result = await PlayerService.playerList(filters);
    return result.response;
  };
  const fetchCountryList = async () => {
    const result = await PlayerService.countryList();
    if (result.status === 200) {
      setCountries(result.response.data || []);
    }
    return { status: result.status, error: result.error };
  };
  const fetchSegmentationList = async () => {
    const result = await PlayerService.segmentationList();
    if (result.status === 200) {
      setSegmentations(result.response.data || []);
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
        data: result.response.data || [],
        totalRecords: parseInt(result.response.total_records, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };
  useEffect(() => {
    fetchSummary();
    fetchCountryList();
    fetchSegmentationList();
    if (!isB2b) {
      fetchPlayerClasses();
    }
  }, [isB2b]);

  const handleViewPlayer = (player) => {
    navigate(`/users/player/${player.userUID}/${player.userID}/tab/details`);
  };
  const handleChangePlayerStatus = (player) => {
    return PlayerService.changePlayerStatus(player.userUID);
  };

  return (
    <PlayerList
      pageTitle={pageTitle}
      onView={handleViewPlayer}
      onChangeStatus={
        hasPermission(PERMISSIONS.USER.CHANGE_STATUS) ? handleChangePlayerStatus : undefined
      }
      listFor="admin"
      getPlayerList={fetchPlayers}
      countries={countries}
      segmentations={segmentations}
      playerClasses={playerClasses}
      summary={summary}
      onFetchSummary={fetchSummary}
    />
  );
}
