import PlayerLoginHistory from 'components/sections/player-management/login-history/list';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AgentPlayerLoginHistory() {
  const { playerUID } = useParams();
  const { t } = useTranslation();
  const breadcrumbs = [{ title: t('players'), path: '/players' }, { title: t('login_history') }];
  return <PlayerLoginHistory isAgent={true} playerId={playerUID} breadcrumbs={breadcrumbs} />;
}
