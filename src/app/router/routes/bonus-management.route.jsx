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
          <PrivateRoute permission={PERMISSIONS.REFERRAL_MANAGEMENT.VIEW}>
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
          <PrivateRoute permission={PERMISSIONS.BONUS_TEMPLATES.LIST}>
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
  }
];

export default bonusManagementRoute;
