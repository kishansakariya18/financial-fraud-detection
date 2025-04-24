import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
import { Navigate } from 'react-router';

export const emailTemplateRoute = [
  {
    path: 'email-template',
    lazy: async () => {
      const { default: EmailTemplateList } = await import('../../pages/email-template/list/list');
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
    path: 'email-template/add',
    lazy: async () => {
      const { default: CreateEmailTemplate } = await import(
        '../../pages/email-template/CreateEmailTemplate'
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
    path: 'email-template/:templateId/edit',
    lazy: async () => {
      const { default: EditEmailTemplate } = await import(
        '../../pages/email-template/EditEmailTemplate'
      );
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
    path: 'email-template/:id/tab',
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
          const { CreateEmailTemplate } = await import(
            '../../pages/email-template/CreateEmailTemplate'
          );
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

export default emailTemplateRoute;
