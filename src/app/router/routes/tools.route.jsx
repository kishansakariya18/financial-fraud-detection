export const toolsRoutes = [
  {
    path: 'tools/ip-lookup',
    lazy: async () => {
      const { default: IPLookup } = await import('app/pages/tools/ip-lookup/IPLookup');
      return {
        Component: () => <IPLookup />
      };
    }
  }
];

export default toolsRoutes;
