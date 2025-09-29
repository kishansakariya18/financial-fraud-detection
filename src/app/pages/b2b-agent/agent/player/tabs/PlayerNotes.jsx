import PlayerNotes from 'components/sections/player-management/player-notes/list';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AgentPlayerNotes() {
  const { playerUID } = useParams();
  const { t } = useTranslation();
  const breadcrumbs = [{ title: t('players'), path: '/players' }, { title: t('notes') }];
  return <PlayerNotes isAgent={true} playerId={playerUID} breadcrumbs={breadcrumbs} />;
}
