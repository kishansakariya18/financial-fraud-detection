import { useTranslation } from 'react-i18next';
import { Page } from 'components/shared/Page';
import AssignedPlayersList from 'components/sections/assigned-players/AssignedPlayersList';

export default function AgentAssignedPlayers() {
  const { t } = useTranslation();

  return (
    <Page title={t('nav.calling_agent.assigned_players')}>
      <AssignedPlayersList
        pageTitle={t('nav.calling_agent.assigned_players')}
        enableAssignUnassign={false}
      />
    </Page>
  );
}
