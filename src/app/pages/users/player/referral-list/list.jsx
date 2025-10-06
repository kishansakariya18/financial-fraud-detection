import { useParams } from 'react-router';

// Local Imports - UI, Services, Helpers, Utils

import { useTranslation } from 'react-i18next';
import PlayerReferral from 'components/sections/player-management/referral-list/list';

export default function PlayerReferralTab() {
  const { t } = useTranslation();
  const { playerId } = useParams();

  const breadcrumbItem = [{ title: t('players'), path: '/users/player' }, { title: t('referral') }];

  return <PlayerReferral playerId={playerId} breadcrumbs={breadcrumbItem} />;
}
