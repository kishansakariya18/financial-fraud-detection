// import { Navigate } from "react-router";

export const casinoRoutes = [
  {
    path: 'casino/category/list',
    lazy: async () => ({
      Component: (await import('../../pages/casino-management/category/list/list')).default
    })
  },
  {
    path: '/casino/provider/list',
    lazy: async () => ({
      Component: (await import('../../pages/casino-management/provider/list/list')).default
    })
  },
  {
    path: '/casino/games/list',
    lazy: async () => ({
      Component: (await import('../../pages/casino-management/games/list/list')).default
    })
  }
];

export default casinoRoutes;
