// import { Navigate } from "react-router";

export const casinoRoutes = [
  {
    path: 'casino/category/list',
    lazy: async () => ({
      Component: (await import('../../pages/casino-management/category/list/list')).default
    })
  }
];

export default casinoRoutes;
