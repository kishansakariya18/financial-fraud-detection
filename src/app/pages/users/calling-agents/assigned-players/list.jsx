import { useTranslation } from 'react-i18next';
import AssignedPlayersList from 'components/sections/assigned-players/AssignedPlayersList';

export default function SupervisorAssignedPlayersList() {
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('calling_agents'), path: '/calling-agents/list' },
    { title: t('assigned') + ' ' + t('players') }
  ];

  return (
    <AssignedPlayersList
      pageTitle={t('assigned') + ' ' + t('players')}
      breadcrumbItems={breadcrumbItem}
      enableAssignUnassign={true}
    />
  );
}
