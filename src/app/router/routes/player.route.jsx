import { Navigate } from "react-router";

export const playerRoutes = [
  {
    path: "player",
    lazy: async () => ({
      Component: (await import("../../pages/users/player/index")).default,
    }),
  },
  {
    path: "player/:playerId/tab",
    lazy: async () => ({
      Component: (await import("../../pages/users/player/Tabs")).default,
    }),
    children: [{
        index: true,
        element: <Navigate to="limit" />,
    },
    {
      path: "limit",
      lazy: async () => ({
        Component: (await import("../../pages/users/player/PlayerLimit")).default,
      })
    }
  ]
  },
];

export default playerRoutes;
