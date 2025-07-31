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
        path: 'edit/:releaseNoteId',
        lazy: async () => ({
          Component: (await import('../../pages/release-notes/EditReleaseNote')).default
        })
      },
      {
        path: 'view/:releaseNoteId',
        lazy: async () => {
          const { ViewDetails } = await import('../../pages/release-notes/ViewDetails');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.RELEASE_NOTES.VIEW}>
                <ViewDetails />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default releaseNotesRoutes;
