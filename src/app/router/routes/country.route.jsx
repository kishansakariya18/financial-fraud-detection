// import { Navigate } from "react-router";

import { Navigate } from 'react-router';

export const countryRoutes = [
  // {
  //     path: "country",
  //     children: [
  //       {
  //         index: true,
  //         element: <Navigate to="/country" />,
  //       },
  //     ],
  //   },
  {
    path: 'site-configuration/country',
    lazy: async () => ({
      Component: (await import('../../pages/country/list/list')).default
    })
  },
  {
    path: 'site-configuration/country/:countryId/edit',
    lazy: async () => ({
      Component: (await import('../../pages/country/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="./modules" />
      },
      {
        path: 'modules',
        lazy: async () => ({
          Component: (await import('../../pages/country/blocked-modules/list')).default
        })
      },
      {
        path: 'providers',
        lazy: async () => ({
          Component: (await import('../../pages/country/blocked-providers/list')).default
        })
      }
    ]
  }
];

export default countryRoutes;
