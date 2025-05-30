import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const segmentationRoutes = [
  {
    path: 'segmentation',
    lazy: async () => {
      const { default: SegmentationList } = await import('../../pages/segmentation/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SEGMENTATION.LIST}>
            <SegmentationList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'segmentation/create',
    lazy: async () => {
      const { default: CreateSegmentation } = await import(
        '../../pages/segmentation/CreateSegmentation'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SEGMENTATION.ADD}>
            <CreateSegmentation />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'segmentation/:segmentationId/edit',
    lazy: async () => {
      const { default: EditSegmeantation } = await import(
        '../../pages/segmentation/EditSegmentation'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SEGMENTATION.EDIT}>
            <EditSegmeantation />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'segmentation/:segmentationId/player-list',
    lazy: async () => {
      const { default: UserList } = await import(
        '../../pages/segmentation/segmented-player-list/list'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SEGMENTATION.PLAYER_LIST}>
            <UserList />
          </PrivateRoute>
        )
      };
    }
  }
];

export default segmentationRoutes;
