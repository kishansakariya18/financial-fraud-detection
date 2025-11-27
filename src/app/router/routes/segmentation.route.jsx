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
      const { default: CreateSegmentation } =
        await import('../../pages/segmentation/CreateSegmentation');
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
    path: 'segmentation/:segmentationUID/edit',
    lazy: async () => {
      const { default: EditSegmeantation } =
        await import('../../pages/segmentation/EditSegmentation');
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
    path: 'segmentation/:segmentationUID/player-list',
    lazy: async () => {
      const { default: UserList } =
        await import('../../pages/segmentation/segmented-player-list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SEGMENTATION.PLAYER_LIST}>
            <UserList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'segmentation/:segmentationUID/details',
    lazy: async () => {
      const { default: ViewSegmentation } =
        await import('../../pages/segmentation/ViewSegmentation');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SEGMENTATION.LIST}>
            <ViewSegmentation />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/segmentation/:segmentationId/limits',
    lazy: async () => {
      const { default: Limits } = await import('../../pages/segmentation/limits/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SEGMENTATION_LIMIT.VIEW}>
            <Limits />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/segmentation/:segmentationId/:segmentationLimitUID/limits/edit',
    lazy: async () => {
      const { default: EditSegmantationLimit } =
        await import('../../pages/segmentation/limits/EditSegmantationLimit');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SEGMENTATION_LIMIT.EDIT}>
            <EditSegmantationLimit />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/segmentation/:segmentationId/limits/create',
    lazy: async () => {
      const { default: CreateSegmantationLimit } =
        await import('../../pages/segmentation/limits/CreateSegmantationLimit');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SEGMENTATION_LIMIT.CREATE}>
            <CreateSegmantationLimit />
          </PrivateRoute>
        )
      };
    }
  }
];

export default segmentationRoutes;
