import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const responsibleGamblingRoute = [
  {
    path: '/responsible-gambling',
    lazy: async () => {
      const { default: ResponsibleGamblingList } =
        await import('../../pages/responsible-gambling/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.RESPONSIBLE_GAMING_RESTRICTIONS.VIEW}>
            <ResponsibleGamblingList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/responsible-gambling/view/:restrictionId',
    lazy: async () => {
      const { default: ViewDetails } = await import('../../pages/responsible-gambling/ViewDetails');
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

export default responsibleGamblingRoute;
