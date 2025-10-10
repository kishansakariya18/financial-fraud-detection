export const globalCommissionSettingRoute = [
  {
    path: 'affiliates/commission-setting',
    lazy: async () => ({
      Component: (await import('../../pages/global-commission-settings/index')).default
    })
  }
];

export default globalCommissionSettingRoute;
