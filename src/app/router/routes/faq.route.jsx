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
        lazy: async () => ({
          Component: (await import('../../pages/faq/CreateFAQ')).default
        })
      },
      {
        path: 'edit/:faqUID',
        lazy: async () => ({
          Component: (await import('../../pages/faq/EditFAQ')).default
        })
      }
    ]
  }
];

export default faqRoutes;
