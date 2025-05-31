import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const tenantRoute = [
  {
    path: 'tenant',
    lazy: async () => {
      const { default: TenantList } = await import('../../pages/tenant/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.TENANT.VIEW}>
            <TenantList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'tenant/create',
    lazy: async () => {
      const { default: CreateTenant } = await import('../../pages/tenant/CreateTenant');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.TENANT.CREATE}>
            <CreateTenant />
          </PrivateRoute>
        )
      };
    }
  }
];

export default tenantRoute;
