import PlayerTransactions from 'components/sections/player-management/transaction-list/list';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AgentPlayerTransactions() {
  const { playerUID } = useParams();
  const { t } = useTranslation();
  const breadcrumbs = [{ title: t('players'), path: '/players' }, { title: t('transactions') }];
  return <PlayerTransactions isAgent={true} playerId={playerUID} breadcrumbs={breadcrumbs} />;
}
