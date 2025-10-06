import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PlayerViewDetails } from 'components/sections/player-management/PlayerViewDetails';

export default function AgentPlayerDetails() {
  const { playerId } = useParams();
  const { t } = useTranslation();
  const customBreadcrumbs = [
    { title: t('assigned_players'), path: '/calling-agents/assigned-players' },
    { title: t('details') }
  ];
  return (
    <PlayerViewDetails isAgent={true} playerId={playerId} customBreadcrumbs={customBreadcrumbs} />
  );
}
