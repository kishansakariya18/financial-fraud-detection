import { PERMISSIONS } from 'constants/app.constant';
// import { Navigate } from 'react-router';
import PrivateRoute from '../private';

export const releaseNotesRoutes = [
  {
    path: 'release-notes',
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: ReleaseNotesList } = await import('../../pages/release-notes/list/list');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.RELEASE_NOTES.VIEW}>
                <ReleaseNotesList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'add',
        lazy: async () => ({
          Component: (await import('../../pages/release-notes/AddReleaseNote')).default
        })
      },
      {
        path: 'edit/:roleId',
        lazy: async () => ({
          Component: (await import('../../pages/release-notes/EditReleaseNote')).default
        })
      }
    ]
  }
];

export default releaseNotesRoutes;
