import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const homeCategoryRoute = [
  {
    path: 'home-category',
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
    path: 'home-games/:homeCategoryId/list',
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
    path: 'home-games/:homeCategoryId/add-game-list',
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
    path: 'home-category/reorder-category',
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
    path: 'home-games/:homeCategoryId/reorder-games',
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
  }
];

export default homeCategoryRoute;
