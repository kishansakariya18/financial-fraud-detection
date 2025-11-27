import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const casinoRoutes = [
  {
    path: 'casino/category/list',
    lazy: async () => {
      const { default: List } = await import('../../pages/casino-management/category/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CATEGORY.VIEW}>
            <List />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/casino/provider/list',
    lazy: async () => {
      const { default: List } = await import('../../pages/casino-management/provider/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PROVIDER.VIEW}>
            <List />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/casino/aggregator/list',
    lazy: async () => {
      const { default: List } = await import('../../pages/casino-management/aggregator/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AGGREGATORS.VIEW}>
            <List />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/casino/provider/reorder',
    lazy: async () => {
      const { default: ReorderProvider } =
        await import('../../pages/casino-management/provider/ReorderProvider');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PROVIDER.EDIT}>
            <ReorderProvider />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/casino/provider/list/select-countries/:providerId/list',
    lazy: async () => {
      const { default: CountryList } =
        await import('../../pages/casino-management/provider/restricted-countries-list/countryList');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PROVIDER.VIEW_RESTRICTED_COUNTRY}>
            <CountryList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/casino/provider/list/restricted-countries/:providerId/list',
    lazy: async () => {
      const { default: RestrictedCountry } =
        await import('../../pages/casino-management/provider/restricted-countries-list/restrictedCountry');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PROVIDER.VIEW_RESTRICTED_COUNTRY}>
            <RestrictedCountry />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/casino/games/list',
    lazy: async () => {
      const { default: List } = await import('../../pages/casino-management/games/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.GAME.VIEW}>
            <List />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/casino/games/list/:gameUID/edit',
    lazy: async () => {
      const { default: EditGame } = await import('../../pages/casino-management/games/EditGame');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.GAME.EDIT}>
            <EditGame />
          </PrivateRoute>
        )
      };
    }
  }
];

export default casinoRoutes;
