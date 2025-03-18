export const playerRoutes = [
  {
    path: "player",
    lazy: async () => ({
      Component: (await import("../../pages/users/player/index")).default,
    }),
  },
];

export default playerRoutes;
