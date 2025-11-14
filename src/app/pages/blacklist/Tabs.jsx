import { useTranslation } from 'react-i18next';
import { ListBulletIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';

export default function Tabs() {
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: 'IP ' + t('address'),
      path: `/blacklist/tab/ip`,
      icon: ListBulletIcon,
      index: 0,
      permission: PERMISSIONS.BLACKLIST.VIEW
    },
    {
      id: randomId(),
      title: t('email') + ' & ' + t('phone_number'),
      path: `/blacklist/tab/email-phone`,
      icon: EnvelopeIcon,
      index: 1,
      permission: PERMISSIONS.BLACKLIST.VIEW_EMAIL_MOBILE_RESTRCTION
    },
    {
      id: randomId(),
      title: t('disposable') + ' ' + t('email'),
      path: `/blacklist/tab/disposable-email`,
      icon: EnvelopeIcon,
      permission: PERMISSIONS.BLACKLIST.VIEW_RESTRICTED_EMAIL_DOMAIN,
      index: 1
    }
  ];

  return <TabsPage tabs={tabs} />;
}
