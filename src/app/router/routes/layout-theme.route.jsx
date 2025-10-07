import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const layoutThemeRoute = [
  {
    path: 'layout/layout-theme',
    lazy: async () => {
      const { default: LayoutThemeList } = await import(
        '../../pages/frontend/layout-theme/list/list'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.VIEW}>
            <LayoutThemeList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'layout/layout-theme/create',
    lazy: async () => {
      const { default: CreateLayoutTheme } = await import(
        '../../pages/frontend/layout-theme/CreateLayoutTheme'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.VIEW}>
            <CreateLayoutTheme />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'layout/layout-theme/edit/:layoutThemeID',
    lazy: async () => {
      const { default: EditLayoutTheme } = await import(
        '../../pages/frontend/layout-theme/EditLayoutTheme'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.FRONTEND.VIEW}>
            <EditLayoutTheme />
          </PrivateRoute>
        )
      };
    }
  }
];

export default layoutThemeRoute;
