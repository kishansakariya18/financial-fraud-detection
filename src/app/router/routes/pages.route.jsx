import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
import { Navigate } from 'react-router';

export const pagesRoute = [
  {
    path: 'pages',
    lazy: async () => {
      const { default: EmailTemplateList } = await import('../../pages/pages/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EMAIL_TEMPLATE.LIST}>
            <EmailTemplateList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'pages/add',
    lazy: async () => {
      const { default: CreateEmailTemplate } = await import(
        '../../pages/pages/CreateEmailTemplate'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EMAIL_TEMPLATE.ADD}>
            <CreateEmailTemplate />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'pages/:templateId/edit',
    lazy: async () => {
      const { default: EditEmailTemplate } = await import('../../pages/pages/EditEmailTemplate');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EMAIL_TEMPLATE.EDIT}>
            <EditEmailTemplate />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'pages/:id/tab',
    lazy: async () => ({
      Component: (await import('../../pages/player-kyc/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="details" />
      },
      {
        path: 'add',
        lazy: async () => {
          const { CreateEmailTemplate } = await import('../../pages/pages/CreateEmailTemplate');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER_KYC.VIEW}>
                <CreateEmailTemplate />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default pagesRoute;
