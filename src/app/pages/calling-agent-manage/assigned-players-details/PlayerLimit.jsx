import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import PlayerLimit from 'components/sections/player-management/PlayerLimit';

export default function AgentPlayerLimit() {
  const { playerId } = useParams();
  const { t } = useTranslation();
  const customBreadcrumbs = [
    { title: t('assigned_players'), path: '/calling-agents/assigned-players' },
    { title: t('limit') }
  ];
  return <PlayerLimit playerId={playerId} breadcrumbs={customBreadcrumbs} />;
}
