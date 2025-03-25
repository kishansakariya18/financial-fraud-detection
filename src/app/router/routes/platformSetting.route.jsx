export const platformRoute = [
  {
    path: "platform",
    lazy: async () => ({
      Component: (await import("../../pages/platform-limit/PlatformLimit")).default,
    })
  },
  {
    path: "platform-limit",
    lazy: async () => ({
      Component: (await import("../../pages/platform-limit/PlatformLimit")).default,
    })
  }
];

export default platformRoute;
