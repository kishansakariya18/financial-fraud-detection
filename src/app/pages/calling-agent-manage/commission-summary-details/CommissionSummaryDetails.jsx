import CommissionSummaryDetails from 'components/sections/commission-summary-details/CommissionSummaryDetails';
import { useTranslation } from 'react-i18next';

export default function AgentCommissionSummaryDetails() {
  const { t } = useTranslation();
  const breadcrumbs = [
    { title: t('commission_summary'), path: '/calling-agents/summary' },
    { title: t('details') }
  ];

  return <CommissionSummaryDetails isAgentView={true} breadcrumbs={breadcrumbs} />;
}
