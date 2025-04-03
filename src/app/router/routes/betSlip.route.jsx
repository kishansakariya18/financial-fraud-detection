// import { Navigate } from "react-router";

export const reportsRoutes = [
  {
    path: 'report/betslip-transctions',
    lazy: async () => ({
      Component: (await import('../../pages/reports/list/list')).default
    })
  }
];

export default reportsRoutes;
