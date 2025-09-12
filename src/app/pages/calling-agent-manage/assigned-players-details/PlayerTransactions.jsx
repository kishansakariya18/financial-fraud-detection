import PlayerTransactions from 'components/sections/player-management/transaction-list/list';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AgentPlayerTransactions() {
  const { playerId } = useParams();
  const { t } = useTranslation();
  const breadcrumbs = [
    { title: t('assigned_players'), path: '/calling-agents/assigned-players' },
    { title: t('transactions') }
  ];
  return <PlayerTransactions isAgent={true} playerId={playerId} breadcrumbs={breadcrumbs} />;
}
