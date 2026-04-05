export const categoryRoute = [
  {
    path: 'dashboards/categories',
    lazy: async () => {
      const { default: CategoriesPage } = await import('../../pages/categories/index');
      return {
        Component: CategoriesPage
      };
    }
  }
];

export default categoryRoute;
