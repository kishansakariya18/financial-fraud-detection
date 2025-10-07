import PlayerReferrals from 'components/sections/player-management/referral-list/list';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AgentPlayerReferrals() {
  const { playerId } = useParams();
  const { t } = useTranslation();
  const breadcrumbs = [
    { title: t('assigned_players'), path: '/calling-agents/assigned-players' },
    { title: t('referral') }
  ];
  return <PlayerReferrals isAgent={true} playerId={playerId} breadcrumbs={breadcrumbs} />;
}
