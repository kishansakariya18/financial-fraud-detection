import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const toolsRoutes = [
  {
    path: 'tools/ip-lookup',
    lazy: async () => {
      const { default: IPLookup } = await import('app/pages/tools/ip-lookup/IPLookup');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.IP_LOOKUP.VIEW}>
            <IPLookup />
          </PrivateRoute>
        )
      };
    }
  }
];

export default toolsRoutes;
