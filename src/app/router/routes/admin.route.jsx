export const adminRoute = [
  {
    path: "admin",
    lazy: async () => ({
      Component: (await import("../../pages/users/admin/index")).default,
    })
  },
];

export default adminRoute;
