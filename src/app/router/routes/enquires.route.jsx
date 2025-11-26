import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const enquiresRoute = [
  {
    path: '/enquires',
    lazy: async () => {
      const { default: EnquiresList } = await import('../../pages/enquires/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.RESPONSIBLE_GAMING_RESTRICTIONS.VIEW}>
            <EnquiresList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/enquires/view/:restrictionId',
    lazy: async () => {
      const { default: ViewDetails } = await import('../../pages/enquires/ViewDetails');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.RESPONSIBLE_GAMING_RESTRICTIONS.VIEW}>
            <ViewDetails />
          </PrivateRoute>
        )
      };
    }
  }
];

export default enquiresRoute;
