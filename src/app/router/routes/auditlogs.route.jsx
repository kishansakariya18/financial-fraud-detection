import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
// import { Navigate } from 'react-router';

export const auditlogsRoute = [
  {
    path: 'auditlogs',
    lazy: async () => {
      const { default: AuditLogsList } = await import('../../pages/auditlogs/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AUDIT_LOG.VIEW}>
            <AuditLogsList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'auditlogs/:auditLogID/view',
    lazy: async () => {
      const { default: ViewPage } = await import('../../pages/auditlogs/ViewDetails');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EVENT_TEMPLATE.LIST}>
            <ViewPage />
          </PrivateRoute>
        )
      };
    }
  }
  // {
  //   path: 'auditlogs/:Id/tab',
  //   lazy: async () => ({
  //     Component: (await import('../../pages/auditlogs/')).default
  //   }),
  //   children: [
  //     {
  //       index: true,
  //       element: <Navigate to="details" />
  //     },
  //     {
  //       path: 'details',
  //       lazy: async () => {
  //         const { ViewDetails } = await import('../../pages/auditlogs/EditRole');
  //         return {
  //           Component: () => (
  //             <PrivateRoute permission={PERMISSIONS.AUDIT_LOGS.VIEW}>
  //               <ViewDetails />
  //             </PrivateRoute>
  //           )
  //         };
  //       }
  //     }
  //   ]
  // }
];

export default auditlogsRoute;
