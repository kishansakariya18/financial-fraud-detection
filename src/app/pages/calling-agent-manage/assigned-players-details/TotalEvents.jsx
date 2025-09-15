import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import CommissionEventsList from 'components/sections/commission-events/list';

export default function TotalEvents() {
  const { t } = useTranslation();
  const { playerId } = useParams();

  const breadcrumbs = [
    { title: t('calling_agent'), path: '/agent' },
    { title: t('assigned_players'), path: '/calling-agents/assigned-players' },
    { title: t('total_events') }
  ];

  return (
    <Page title={t('total_events')}>
      <CommissionEventsList
        playerUID={playerId}
        breadcrumbs={breadcrumbs}
        pageTitle={t('total_events')}
      />
    </Page>
  );
}
