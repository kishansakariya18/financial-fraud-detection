// Local Imports
// import TabNavigation from "./ShiftLeftAnimation";
import { UserIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { TbLockPassword, TbPassword } from 'react-icons/tb';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('profile'),
      path: `/profile/change-profile`,
      icon: UserIcon,
      index: 0
    },
    {
      id: randomId(),
      title: t('change') + ' ' + t('profile') + ' ' + t('password'),
      path: `/profile/change-password`,
      icon: TbPassword,
      index: 1
    },
    {
      id: randomId(),
      title: t('change') + ' ' + t('transaction') + ' ' + t('password'),
      path: `/profile/player-fund-password`,
      icon: TbLockPassword,
      index: 2
    }
  ];

  return <TabsPage tabs={tabs} />;
}
