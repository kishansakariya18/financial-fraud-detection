import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
import { Navigate } from 'react-router';

export const promocodeRoute = [
  {
    path: 'promocode',
    lazy: async () => {
      const { default: PromoCodeList } = await import('../../pages/promocode/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.DEPOSIT_PROMOCODE.LIST}>
            <PromoCodeList />
          </PrivateRoute>
        )
      };
    }
  },

  {
    path: 'promocode/:promocodeId/tab',
    lazy: async () => ({
      Component: (await import('../../pages/promocode/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="./details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { ViewDetails: PromoCodeDetails } = await import(
            '../../pages/promocode/ViewDetails'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.DEPOSIT_PROMOCODE.LIST}>
                <PromoCodeDetails />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'promocode-history',
        lazy: async () => {
          const { default: PromocodeHistory } = await import('../../pages/promocode/history/list');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.DEPOSIT_PROMOCODE.USER_LIST}>
                <PromocodeHistory />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  },
  {
    path: 'promocode/create',
    lazy: async () => {
      const { default: CreatePromoCode } = await import('../../pages/promocode/CreatePromocode');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.DEPOSIT_PROMOCODE.ADD}>
            <CreatePromoCode />
          </PrivateRoute>
        )
      };
    }
  }
];

export default promocodeRoute;
