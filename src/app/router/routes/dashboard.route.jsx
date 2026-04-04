/*import { Navigate } from 'react-router';

export const dashboardRoute = [
  {
    index: true,
    element: <Navigate to="/dashboards/home" replace />
  },
  {
    path: '/dashboards/home',
    children: [
      {
        index: true,
        element: <Navigate to="/dashboards/home" />
      },
      {
        path: 'home',
        lazy: async () => {
          const { default: AdminDashboard } = await import('../../pages/dashboards/home');
          return {
            Component: () => <AdminDashboard />
          };
        }
      }
    ]
  }
];

export default dashboardRoute;
*/

import { Navigate } from 'react-router-dom';

export const dashboardRoute = [
  {
    path: '/dashboards/home',
    lazy: async () => {
      const { default: AdminDashboard } = await import('../../pages/dashboards/home');
      return {
        Component: () => <AdminDashboard />
      };
    }
  },
  {
    path: '/',
    element: <Navigate to="/dashboards/home" replace />
  }
];

export default dashboardRoute;
