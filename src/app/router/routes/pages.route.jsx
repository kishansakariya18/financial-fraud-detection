import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
import { Navigate } from 'react-router';

export const pagesRoute = [
  {
    path: 'content-management/pages',
    lazy: async () => {
      const { default: PageList } = await import('../../pages/pages/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PAGE.VIEW}>
            <PageList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/pages/:pageID/edit',
    lazy: async () => {
      const { default: EditPage } = await import('../../pages/pages/EditPages');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PAGE.EDIT}>
            <EditPage />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/pages/:pageID/view',
    lazy: async () => {
      const { default: ViewPage } = await import('../../pages/pages/ViewDetails');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PAGE.VIEW}>
            <ViewPage />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/pages/:id/tab',
    lazy: async () => ({
      Component: (await import('../../pages/player-kyc/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="details" />
      }
    ]
  }
];

export default pagesRoute;
