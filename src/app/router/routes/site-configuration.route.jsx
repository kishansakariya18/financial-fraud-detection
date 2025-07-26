export const siteConfigurationRoutes = [
  {
    path: 'site-configuration/app-settings',
    lazy: async () => {
      const { default: ApplicationSettings } = await import(
        '../../pages/site-configuration/app-settings'
      );
      return {
        Component: () => <ApplicationSettings />
      };
    }
  }
];

export default siteConfigurationRoutes;
