// Import Dependencies
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { HomeIcon, UserGroupIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';

const TabSegmentation = () => {
  const { segmentationUID } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/bonus/player-segmentation/${segmentationUID}/tab/details`,
      icon: HomeIcon,
      index: 0,
      permission: PERMISSIONS.PLAYER_SEGMENTATION.VIEW
    },
    {
      id: randomId(),
      title: t('players'),
      path: `/bonus/player-segmentation/${segmentationUID}/tab/players`,
      icon: UserGroupIcon,
      index: 1,
      permission: PERMISSIONS.PLAYER_SEGMENTATION.PLAYER_LIST
    },
    {
      id: randomId(),
      title: t('logs'),
      path: `/bonus/player-segmentation/${segmentationUID}/tab/logs`,
      icon: ListBulletIcon,
      index: 2,
      permission: PERMISSIONS.PLAYER_SEGMENTATION.VIEW // Assuming same permission for logs for now
    }
  ];

  return <TabsPage tabs={tabs} />;
};

export default TabSegmentation;
