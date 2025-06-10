// import { Navigate } from "react-router";

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
  }
];

export default countryRoutes;
