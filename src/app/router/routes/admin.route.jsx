import { Navigate } from "react-router";


export const adminRoute = [
  {
    path: "admin",
    lazy: async () => ({
      Component: (await import("../../pages/users/admin/index")).default,
    })
  },
  {
    path: "admin/:adminId/tab",
    lazy: async () => ({
      Component: (await import("../../pages/users/admin/Tabs")).default,
    }),
    children: [{
        index: true,
        element: <Navigate to="details" />,
    },
    {
      path: "details",
      lazy: async () => ({
        Component: (await import("../../pages/users/admin/ViewDetails")).ViewDetails,
      })
    }
  ]

  },
  {
    path: "admin/create",
    lazy: async () => ({
      Component: (await import("../../pages/users/admin/CreateAdmin")).default,
    })
  },
];

export default adminRoute;
