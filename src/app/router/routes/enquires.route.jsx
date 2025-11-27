import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const enquiresRoute = [
  {
    path: '/enquires',
    lazy: async () => {
      const { default: EnquiresList } = await import('../../pages/enquires/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.ENQUIRES.LIST}>
            <EnquiresList />
          </PrivateRoute>
        )
      };
    }
  }
];

export default enquiresRoute;
