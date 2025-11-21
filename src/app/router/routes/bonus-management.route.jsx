import PrivateRoute from '../private';
import { PERMISSIONS } from 'constants/app.constant';

export const bonusManagementRoute = [
  {
    path: 'bonus/referral-management',
    lazy: async () => {
      const { default: ReferralManagement } = await import(
        '../../pages/referral-management/ReferralManagement'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.REFERRAL_MANAGEMENT.EDIT}>
            <ReferralManagement />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus/templates',
    lazy: async () => {
      const { default: BonusTemplateList } = await import('../../pages/bonus-template/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BONUS_TEMPLATES.VIEW}>
            <BonusTemplateList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus/templates/create',
    lazy: async () => {
      const { default: CreateBonusTemplate } = await import(
        '../../pages/bonus-template/CreateBonusTemplate'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BONUS_TEMPLATES.ADD}>
            <CreateBonusTemplate />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus/templates/:templateId/edit',
    lazy: async () => {
      const { default: EditBonusTemplate } = await import(
        '../../pages/bonus-template/EditBonusTemplate'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BONUS_TEMPLATES.EDIT}>
            <EditBonusTemplate />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus/templates/:templateId/view',
    lazy: async () => {
      const { default: ViewBonusTemplate } = await import(
        '../../pages/bonus-template/ViewBonusTemplate'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BONUS_TEMPLATES.VIEW}>
            <ViewBonusTemplate />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus/player-segmentation',
    lazy: async () => {
      const { default: PlayerSegmentationList } = await import(
        '../../pages/player-segmentation/list/list'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PLAYER_SEGMENTATION.LIST}>
            <PlayerSegmentationList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus/player-segmentation/create',
    lazy: async () => {
      const { default: CreatePlayerSegmentation } = await import(
        '../../pages/player-segmentation/CreatePlayerSegmentation'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PLAYER_SEGMENTATION.ADD}>
            <CreatePlayerSegmentation />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus/player-segmentation/:segmentationUID/edit',
    lazy: async () => {
      const { default: EditPlayerSegmentation } = await import(
        '../../pages/player-segmentation/EditPlayerSegmentation'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PLAYER_SEGMENTATION.EDIT}>
            <EditPlayerSegmentation />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus/player-segmentation/:segmentationUID/view',
    lazy: async () => {
      const { default: ViewPlayerSegmentation } = await import(
        '../../pages/player-segmentation/ViewPlayerSegmentation'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PLAYER_SEGMENTATION.VIEW}>
            <ViewPlayerSegmentation />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus/player-segmentation/:segmentationUID/players',
    lazy: async () => {
      const { default: PlayerSegmentationPlayerList } = await import(
        '../../pages/player-segmentation/PlayerSegmentationPlayerList'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PLAYER_SEGMENTATION.PLAYER_LIST}>
            <PlayerSegmentationPlayerList />
          </PrivateRoute>
        )
      };
    }
  }
];

export default bonusManagementRoute;
