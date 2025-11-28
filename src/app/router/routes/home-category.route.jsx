import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const homeCategoryRoute = [
  {
    path: 'web/home-category',
    lazy: async () => {
      const { default: HomeCategoryList } = await import('../../pages/frontend/home-category/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.VIEW}>
            <HomeCategoryList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'web/home-category/:homeCategoryId/list',
    lazy: async () => {
      const { default: HomeGameList } = await import('../../pages/frontend/home-games/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.VIEW_HOME_GAMES}>
            <HomeGameList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'web/home-category/:homeCategoryId/add-game-list',
    lazy: async () => {
      const { default: AddHomeGameList } = await import('../../pages/frontend/add-home-games/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.ADD_HOME_GAMES}>
            <AddHomeGameList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'web/home-category/reorder-category',
    lazy: async () => {
      const { default: ReOrderCategory } = await import(
        '../../pages/frontend/home-category/ReOrderCategory'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.REORDER_HOME_CATEGORY}>
            <ReOrderCategory />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'web/home-category/:homeCategoryId/reorder-games',
    lazy: async () => {
      const { default: ReOrderGames } = await import(
        '../../pages/frontend/home-games/ReOrderGames'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.REORDER_HOME_GAMES}>
            <ReOrderGames />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'web/appearance/create',
    lazy: async () => {
      const { default: CreateAppearance } = await import(
        '../../pages/frontend/appearance/CreateAppearance'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.ADD_APPEARANCE}>
            <CreateAppearance />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'web/appearance',
    lazy: async () => {
      const { default: Appearance } = await import('../../pages/frontend/appearance/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.APPEARANCE_VIEW}>
            <Appearance />
          </PrivateRoute>
        )
      };
    }
  }
];

export default homeCategoryRoute;
