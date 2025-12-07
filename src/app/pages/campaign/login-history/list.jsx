import { useParams } from 'react-router';

import { useTranslation } from 'react-i18next';

export default function CampaignLoginHistoryList() {
  const { campaignUID } = useParams();
  const { t } = useTranslation();
  const breadcrumbs = [{ title: t('campaign'), path: '/campaign' }, { title: t('details') }];

  // Note: Using playerId temporarily until campaign-specific login history API is ready
  // This will be updated once the backend provides campaign login history endpoint
  return <CampaignLoginHistoryList playerId={campaignUID} breadcrumbs={breadcrumbs} />;
}
