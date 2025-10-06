import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PlayerViewDetails } from 'components/sections/player-management/PlayerViewDetails';

export function ViewDetails() {
  const { playerId } = useParams();
  const { t } = useTranslation();
  const breadcrumbItem = [{ title: t('players'), path: '/users/player' }, { title: t('details') }];

  return <PlayerViewDetails playerId={playerId} customBreadcrumbs={breadcrumbItem} />;
}
