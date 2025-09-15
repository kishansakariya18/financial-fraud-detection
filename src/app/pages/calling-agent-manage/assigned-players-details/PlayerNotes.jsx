import PlayerNotes from 'components/sections/player-management/player-notes/list';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AgentPlayerNotes() {
  const { playerId } = useParams();
  const { t } = useTranslation();
  const breadcrumbs = [
    { title: t('assigned_players'), path: '/calling-agents/assigned-players' },
    { title: t('notes') }
  ];
  return <PlayerNotes isAgent={true} playerId={playerId} breadcrumbs={breadcrumbs} />;
}
