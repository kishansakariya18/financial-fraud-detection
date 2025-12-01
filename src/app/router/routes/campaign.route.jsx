import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const campaignRoute = [
  {
    path: '/campaign',
    lazy: async () => {
      const { default: CampaignList } = await import('../../pages/campaign/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CAMPAIGN?.VIEW}>
            <CampaignList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/campaign/create',
    lazy: async () => {
      const { default: CreateCampaign } = await import('../../pages/campaign/CreateCampaign');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CAMPAIGN?.CREATE}>
            <CreateCampaign />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/campaign/:campaignUID/edit',
    lazy: async () => {
      const { default: EditCampaign } = await import('../../pages/campaign/EditCampaign');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CAMPAIGN?.EDIT}>
            <EditCampaign />
          </PrivateRoute>
        )
      };
    }
  }
];

export default campaignRoute;
