import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import PlayerLimit from 'components/sections/player-management/PlayerLimit';

const PlayerLimitTab = () => {
  const { playerId } = useParams();
  const { t } = useTranslation();
  const breadcrumbItem = [
    { title: t('players'), path: '/users/player' },
    { title: t('player') + ' ' + t('limit') }
  ];

  return <PlayerLimit playerId={playerId} breadcrumbs={breadcrumbItem} />;
};

export default PlayerLimitTab;
