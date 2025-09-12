// Local Imports
// import TabNavigation from "./ShiftLeftAnimation";
import { UserIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { TbLockPassword, TbPassword } from 'react-icons/tb';
import { ADMIN_TYPE } from 'constants/app.constant';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { t } = useTranslation();
  const { userData } = useSelector((state) => state.auth);

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
      isHidden: userData.AdminType === ADMIN_TYPE.AGENT,
      index: 2
    }
  ];

  return <TabsPage tabs={tabs} />;
}
