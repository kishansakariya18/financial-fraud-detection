import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
// import { Navigate } from 'react-router';

export const pagesRoute = [
  // {
  //   path: 'pages',
  //   lazy: async () => {
  //     const { default: EmailTemplateList } = await import('../../pages/pages/list/list');
  //     return {
  //       Component: () => (
  //         <PrivateRoute permission={PERMISSIONS.CRM.VIEW}>
  //           <EmailTemplateList />
  //         </PrivateRoute>
  //       )
  //     };
  //   }
  // },
  {
    path: 'crm/notifications/send',
    lazy: async () => {
      const { default: Send } = await import('../../pages/crm/Send');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CRM.SEND_NOTIFICATION}>
            <Send />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'crm/notifications',
    lazy: async () => {
      const { default: NotificationList } = await import('../../pages/crm/notifications/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CRM.VIEW}>
            <NotificationList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'crm/notifications/view/:notificationId',
    lazy: async () => {
      const { default: NotificationView } = await import('../../pages/crm/notifications/view/View');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CRM.VIEW}>
            <NotificationView />
          </PrivateRoute>
        )
      };
    }
  }
  // {
  //   path: 'pages/:id/tab',
  //   lazy: async () => ({
  //     Component: (await import('../../pages/player-kyc/Tabs')).default
  //   }),
  //   children: [
  //     {
  //       index: true,
  //       element: <Navigate to="details" />
  //     },
  //     {
  //       path: 'add',
  //       lazy: async () => {
  //         const { CreateEmailTemplate } = await import('../../pages/pages/CreateEmailTemplate');
  //         return {
  //           Component: () => (
  //             <PrivateRoute permission={PERMISSIONS.USER_KYC.VIEW}>
  //               <CreateEmailTemplate />
  //             </PrivateRoute>
  //           )
  //         };
  //       }
  //     }
  //   ]
  // }
];

export default pagesRoute;
