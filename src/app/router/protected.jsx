// Local Imports
import { DynamicLayout } from 'app/layouts/DynamicLayout';
import AuthGuard from 'middleware/AuthGuard';
import AdminRouteGuard from './AdminRouteGuard';
import dashboardRoute from './routes/dashboard.route';
import adminRoute from './routes/admin.route';
import playerRoutes from './routes/player.route';
import profileRoute from './routes/profile.route';
import transactionRoute from './routes/transaction.route';
import categoryRoute from './routes/category.route';
import { Outlet } from 'react-router-dom';
import Analytics from 'app/pages/dashboards/analytics';

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: 'protected',
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        // Admin routes - centrally protected with AdminRouteGuard
        {
          Component: AdminRouteGuard,
          element: <Outlet />,
          children: [
            // Routes available for both B2B and B2C platforms
            ...dashboardRoute,
            ...adminRoute,
            ...playerRoutes,
            ...transactionRoute,
            ...categoryRoute,

            {
              path: 'dashboards/analytics',
              element: <Analytics />
            }
          ]
        },
        ...profileRoute
      ]
    }
  ]
};

export { protectedRoutes };
