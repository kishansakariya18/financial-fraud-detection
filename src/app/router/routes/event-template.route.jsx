import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
import { Navigate } from 'react-router';

export const emailTemplateRoute = [
  {
    path: 'event-template',
    lazy: async () => {
      const { default: EmailTemplateList } = await import('../../pages/event-template/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EVENT_TEMPLATE.VIEW}>
            <EmailTemplateList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'event-template/add',
    lazy: async () => {
      const { default: CreateEmailTemplate } = await import(
        '../../pages/event-template/CreateEventTemplate'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EVENT_TEMPLATE.ADD}>
            <CreateEmailTemplate />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/event-template-assign',
    lazy: async () => {
      const { default: AssignEventToGroup } = await import(
        '../../pages/event-template/AssignEventtemplate'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EVENT_TEMPLATE.EDIT}>
            <AssignEventToGroup />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'event-template/:templateId/edit',
    lazy: async () => {
      const { default: EditEmailTemplate } = await import(
        '../../pages/event-template/EditEventTemplate'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EVENT_TEMPLATE.EDIT}>
            <EditEmailTemplate />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'event-template/:id/tab',
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
            '../../pages/event-template/CreateEventTemplate'
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
