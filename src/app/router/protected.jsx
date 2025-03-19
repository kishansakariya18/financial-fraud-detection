// Local Imports
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

import dashboardRoute from "./routes/dashboard.route";
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
        ...dashboardRoute,
        ...adminRoute,
        ...playerRoutes,
      ],
    },
  ],
};

export { protectedRoutes };
