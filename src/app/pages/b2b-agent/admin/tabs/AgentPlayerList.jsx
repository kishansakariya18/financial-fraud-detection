import PlayerList from 'components/sections/player-management/player-list/PlayerList';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import PlayerService from 'services/player.services';

export default function AgentPlayerList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { agentUID } = useParams();
  const pageTitle = t('players');

  const fetchPlayers = (requestObject) => {
    return PlayerService.playerList({ ...requestObject, agentUID })
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

  const handleViewPlayer = (player) => {
    navigate(`/users/${player.userUID}/tab/details`);
  };

  // const handleChangePlayerStatus = async (player) => {
  //   return await B2BAgentService.changePlayerStatus(player.userUID);
  // };

  const breadcrumbs = [{ title: t('agents'), path: '/agent/list' }, { title: t('players') }];

  return (
    <PlayerList
      pageTitle={pageTitle}
      onView={handleViewPlayer}
      // onChangeStatus={handleChangePlayerStatus}
      listFor="agent"
      getPlayerList={fetchPlayers}
      countries={null}
      segmentations={null}
      playerClasses={null}
      summary={null}
      onFetchSummary={null}
      breadcrumbs={breadcrumbs}
    />
  );
}
