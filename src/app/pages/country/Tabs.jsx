import { useParams } from 'react-router';
import { LockClosedIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import TabsPage from 'components/custom/TabsPage';
import { useTranslation } from 'react-i18next';

export default function Tabs() {
  const { countryId } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('blockedModules'),
      path: `/site-configuration/country/${countryId}/edit/modules`,
      icon: LockClosedIcon,
      index: 0
    },
    {
      id: randomId(),
      title: t('blockedProviders'),
      path: `/site-configuration/country/${countryId}/edit/providers`,
      icon: BuildingStorefrontIcon,
      index: 1
    }
  ];

  return <TabsPage tabs={tabs} />;
}
