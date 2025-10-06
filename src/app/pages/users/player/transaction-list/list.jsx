import { useParams } from 'react-router';

import { useTranslation } from 'react-i18next';
import PlayerTransactions from 'components/sections/player-management/transaction-list/list';

export default function PlayerTransactionList() {
  const { t } = useTranslation();
  const { playerId } = useParams();
  const breadcrumbItem = [
    { title: t('players'), path: '/users/player' },
    { title: t('transactions') }
  ];
  return <PlayerTransactions playerId={playerId} breadcrumbs={breadcrumbItem} />;
}
