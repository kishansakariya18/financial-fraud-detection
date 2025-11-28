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
              <PrivateRoute permission={PERMISSIONS.RELEASE_NOTE.VIEW}>
                <ReleaseNotesList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'add',
        lazy: async () => {
          const { default: AddReleaseNote } =
            await import('../../pages/release-notes/AddReleaseNote');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.RELEASE_NOTE.ADD}>
                <AddReleaseNote />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'edit/:releaseNoteId',
        lazy: async () => {
          const { default: EditReleaseNote } =
            await import('../../pages/release-notes/EditReleaseNote');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.RELEASE_NOTE.EDIT}>
                <EditReleaseNote />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'view/:releaseNoteId',
        lazy: async () => {
          const { ViewDetails } = await import('../../pages/release-notes/ViewDetails');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.RELEASE_NOTE.VIEW}>
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
