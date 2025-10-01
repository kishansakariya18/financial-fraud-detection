import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
import { Navigate } from 'react-router';

export const bonusCampaignRoute = [
  {
    path: 'bonus-campaign',
    lazy: async () => {
      const { default: BonusCampaignList } = await import('../../pages/bonus-campaign/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BONUS_CAMPAIGN?.LIST}>
            <BonusCampaignList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'bonus-campaign/:bonusCampaignId/tab',
    lazy: async () => ({
      Component: (await import('../../pages/bonus-campaign/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="./details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { ViewDetails } = await import('../../pages/bonus-campaign/ViewDetails');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.BONUS_CAMPAIGN?.VIEW}>
                <ViewDetails />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'history',
        lazy: async () => {
          const { default: BonusCampaignHistory } = await import(
            '../../pages/bonus-campaign/history/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.BONUS_CAMPAIGN?.HISTORY}>
                <BonusCampaignHistory />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  },
  {
    path: 'bonus-campaign/create',
    lazy: async () => {
      const { default: CreateBonusCampaign } = await import(
        '../../pages/bonus-campaign/CreateBonusCampaign'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BONUS_CAMPAIGN?.CREATE}>
            <CreateBonusCampaign />
          </PrivateRoute>
        )
      };
    }
  }
];

export default bonusCampaignRoute;
