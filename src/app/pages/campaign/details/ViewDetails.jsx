import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import CampaignViewDetails from './CampaignViewDetails';

export function ViewDetails() {
  const { campaignUID } = useParams();
  const { t } = useTranslation();
  const breadcrumbItem = [{ title: t('campaign'), path: '/campaign' }, { title: t('details') }];

  return <CampaignViewDetails campaignUID={campaignUID} customBreadcrumbs={breadcrumbItem} />;
}
