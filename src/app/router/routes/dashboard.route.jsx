import { Navigate } from 'react-router';

export const dashboardRoute = [
  {
    index: true,
    element: <Navigate to="/dashboards/home" replace />
  },
  {
    path: 'dashboards',
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
