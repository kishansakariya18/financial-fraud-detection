import { PERMISSIONS } from 'constants/app.constant';
// import { Navigate } from 'react-router';
import PrivateRoute from '../private';

export const faqRoutes = [
  {
    path: 'faq',
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: FAQList } = await import('../../pages/faq/list/list');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.FAQ.VIEW}>
                <FAQList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'add',
        lazy: async () => {
          const { default: CreateFAQ } = await import('../../pages/faq/CreateFAQ');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.FAQ.ADD}>
                <CreateFAQ />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'edit/:faqUID',
        lazy: async () => {
          const { default: EditFAQ } = await import('../../pages/faq/EditFAQ');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.FAQ.EDIT}>
                <EditFAQ />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default faqRoutes;
