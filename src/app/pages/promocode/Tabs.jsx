// Local Imports
import { useParams } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import { HomeIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';
import { BiHistory } from 'react-icons/bi';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { promocodeId } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/promocode/${promocodeId}/tab/details`,
      icon: HomeIcon,
      index: 0,
      permission: PERMISSIONS.DEPOSIT_PROMOCODE.LIST
    },
    {
      id: randomId(),
      title: t('promocode') + ' ' + t('history'),
      path: `/promocode/${promocodeId}/tab/promocode-history`,
      icon: BiHistory,
      index: 0,
      permission: PERMISSIONS.DEPOSIT_PROMOCODE.USER_LIST
    }
  ];

  return <TabsPage tabs={tabs} />;
}
