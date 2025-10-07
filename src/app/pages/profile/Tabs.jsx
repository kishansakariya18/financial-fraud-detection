// Local Imports
// import TabNavigation from "./ShiftLeftAnimation";
import { UserIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { TbLockPassword, TbPassword } from 'react-icons/tb';
import { ADMIN_TYPE } from 'constants/app.constant';
import { useSelector } from 'react-redux';
import { isB2BPlatform } from 'utils/platformNavigation';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { t } = useTranslation();
  const { userData } = useSelector((state) => state.auth);
  const isB2B = isB2BPlatform();

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
      isHidden: isB2B || userData.AdminType === ADMIN_TYPE.AGENT,
      index: 2
    },
    {
      id: randomId(),
      title: t('change') + ' ' + t('agent') + ' ' + t('fund') + ' ' + t('password'),
      path: `/profile/agent-fund-password`,
      icon: TbLockPassword,
      isHidden: !isB2B,
      index: 3
    }
  ];

  return <TabsPage tabs={tabs} />;
}
