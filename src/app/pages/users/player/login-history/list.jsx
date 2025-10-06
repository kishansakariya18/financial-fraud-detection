import { useParams } from 'react-router';

import LoginHistoryList from 'components/sections/player-management/login-history/list';
import { useTranslation } from 'react-i18next';

export default function PlayerLoginHistoryList() {
  const { playerId } = useParams();
  const { t } = useTranslation();
  const breadcrumbs = [{ title: t('players'), path: '/users/player' }, { title: t('details') }];

  return <LoginHistoryList playerId={playerId} breadcrumbs={breadcrumbs} />;
}
