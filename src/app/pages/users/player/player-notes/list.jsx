import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import PlayerNotes from 'components/sections/player-management/player-notes/list';

export default function PlayerNotesPage() {
  const { t } = useTranslation();
  const { playerId } = useParams();

  const breadcrumbItem = [
    { title: t('players'), path: '/users/player' },
    { title: t('player') + ' ' + t('notes') }
  ];

  return <PlayerNotes playerId={playerId} breadcrumbs={breadcrumbItem} />;
}
