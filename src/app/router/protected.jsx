// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";
// import Admin from '../pages/users/admin/index';

import adminRoute from "./routes/admin.route";
import playerRoutes from "./routes/player.route";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards" />,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("../pages/dashboards/home")).default,
              }),
            },
          ],
        },
        ...adminRoute,
        ...playerRoutes,
      ],
    },
  ],
};

export { protectedRoutes };
