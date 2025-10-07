import CommissionSummaryDetails from 'components/sections/commission-summary-details/CommissionSummaryDetails';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

export default function AdminCommissionSummaryDetails() {
  const { t } = useTranslation();
  const { agentUID } = useParams();

  const breadcrumbs = [
    { title: t('calling_agents'), path: '/calling-agents/list' },
    {
      title: t('commission_summary'),
      path: `/calling-agents/list/${agentUID}/tab/commission-summary`
    },
    { title: t('details') }
  ];
  return <CommissionSummaryDetails isAgentView={false} breadcrumbs={breadcrumbs} />;
}
