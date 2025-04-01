// import { Navigate } from "react-router";

export const countryRoutes = [
  {
    path: 'country',
    lazy: async () => ({
      Component: (await import('../../pages/country/list/list')).default
    })
  }
];

export default countryRoutes;
