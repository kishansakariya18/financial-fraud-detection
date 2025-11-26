// Import Dependencies
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
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
      title: t('change_history'),
      path: `/bonus/player-segmentation/${segmentationUID}/tab/change-history`,
      icon: DocumentTextIcon,
      index: 2,
      permission: PERMISSIONS.PLAYER_SEGMENTATION.VIEW
    },
    {
      id: randomId(),
      title: t('player_activity'),
      path: `/bonus/player-segmentation/${segmentationUID}/tab/player-activity`,
      icon: ArrowsRightLeftIcon,
      index: 3,
      permission: PERMISSIONS.PLAYER_SEGMENTATION.VIEW
    }
    // {
    //   id: randomId(),
    //   title: t('execution_history'),
    //   path: `/bonus/player-segmentation/${segmentationUID}/tab/execution-history`,
    //   icon: ClockIcon,
    //   index: 4,
    //   permission: PERMISSIONS.PLAYER_SEGMENTATION.VIEW
    // }
  ];

  return <TabsPage tabs={tabs} />;
};

export default TabSegmentation;
