import { Navigate } from "react-router";

export const dashboardRoute = [
  {
    index: true,
    element: <Navigate to="/dashboards/home" />,
  },
  {
    path: "dashboards",
    children: [
      {
        index: true,
        element: <Navigate to="/dashboards/home" />,
      },
      {
        path: "home",
        lazy: async () => ({
          Component: (await import("../../pages/dashboards/home")).default,
        }),
      },
    ],
  },
];

export default dashboardRoute;
