import { useTranslation } from 'react-i18next';
import { ListBulletIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import TabsPage from 'components/custom/TabsPage';

export default function Tabs() {
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: 'IP ' + t('address'),
      path: `/blacklist/tab/ip`,
      icon: ListBulletIcon,
      index: 0
    },
    {
      id: randomId(),
      title: t('email') + ' & ' + t('phone_number'),
      path: `/blacklist/tab/email-phone`,
      icon: EnvelopeIcon,
      index: 1
    }
  ];

  return <TabsPage tabs={tabs} />;
}
