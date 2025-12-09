import { PERMISSIONS } from 'constants/app.constant';
import { Navigate } from 'react-router';
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
  },
  {
    path: '/campaign/:campaignUID/clone',
    lazy: async () => {
      const { default: CloneCampaign } = await import('../../pages/campaign/CloneCampaign');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CAMPAIGN?.CREATE}>
            <CloneCampaign />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/campaign/:campaignUID/tab',
    lazy: async () => ({
      Component: (await import('../../pages/campaign/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="./details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { ViewDetails: CampaignDetails } = await import(
            '../../pages/campaign/details/ViewDetails'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.CAMPAIGN.VIEW}>
                <CampaignDetails />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'logs',
        lazy: async () => {
          const { default: CampaignLogs } = await import(
            '../../pages/campaign/campaign-logs/CampaignLogs'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.CAMPAIGN.VIEW}>
                <CampaignLogs />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default campaignRoute;
