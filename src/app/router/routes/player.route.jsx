import { Navigate } from "react-router";

export const playerRoutes = [
  {
    path: "player",
    lazy: async () => ({
      Component: (await import("../../pages/users/player/list/list")).default,
    }),
  },
  {
    path: "player/:playerId/tab",
    lazy: async () => ({
      Component: (await import("../../pages/users/player/Tabs")).default,
    }),
    children: [
      {
        index: true,
        element: <Navigate to="details" />,
      },
      {
        path: "details",
        lazy: async () => ({
          Component: (await import("../../pages/users/player/ViewDetails"))
            .ViewDetails,
        }),
      },
      {
        path: "limits",
        lazy: async () => ({
          Component: (await import("../../pages/users/player/PlayerLimit"))
            .default,
        }),
      },
    ],
  },
];

export default playerRoutes;
