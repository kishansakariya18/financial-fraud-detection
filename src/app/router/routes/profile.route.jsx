import { PLATFORM_TYPE } from 'constants/app.constant';
import { Navigate } from 'react-router';
import PrivateRoute from '../private';
// import PrivateRoute from '../private';
// import { PERMISSIONS } from 'constants/app.constant';

export const profileRoute = [
  {
    path: 'profile',
    lazy: async () => ({
      Component: (await import('../../pages/profile/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="./change-profile" />
      },
      {
        path: 'change-profile',
        lazy: async () => {
          const { default: Profile } = await import('../../pages/profile/Profile');
          return {
            Component: () => <Profile />
          };
        }
      },
      {
        path: 'change-password',
        lazy: async () => {
          const { default: ChangePassword } = await import('../../pages/profile/ChangePassword');
          return {
            Component: () => <ChangePassword />
          };
        }
      },
      {
        path: 'player-fund-password',
        lazy: async () => {
          const { default: PlayerFundPassword } = await import(
            '../../pages/profile/PlayerFundPassword'
          );
          return {
            Component: () => (
              <PrivateRoute allowedPlatforms={[PLATFORM_TYPE.B2C]}>
                <PlayerFundPassword />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'affiliate-fund-password',
        lazy: async () => {
          const { default: AffiliateFundPassword } = await import(
            '../../pages/profile/AffiliateFundPassword'
          );
          return {
            Component: () => (
              <PrivateRoute allowedPlatforms={[PLATFORM_TYPE.B2C]}>
                <AffiliateFundPassword />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'agent-fund-password',
        lazy: async () => {
          const { default: AgentFundPassword } = await import(
            '../../pages/profile/AgentFundPassword'
          );
          return {
            Component: () => (
              <PrivateRoute allowedPlatforms={[PLATFORM_TYPE.B2B]}>
                <AgentFundPassword />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default profileRoute;

// import { Navigate } from "react-router";

// import { Navigate } from 'react-router';
// import PrivateRoute from '../private';
// import { PERMISSIONS } from 'constants/app.constant';

// export const profileRoute = [
//   // {
//   //   path: 'users/player',
//   //   lazy: async () => {
//   //     const { default: PlayerList } = await import('../../pages/users/player/list/list');
//   //     return {
//   //       Component: () => (
//   //         <PrivateRoute permission={PERMISSIONS.USER.LIST}>
//   //           <PlayerList />
//   //         </PrivateRoute>
//   //       )
//   //     };
//   //   }
//   // },
//   {
//     path: 'profile/tab',
//     lazy: async () => ({
//       Component: (await import('../../pages/profile/Tabs')).default
//     }),
//     children: [
//       {
//         index: true,
//         element: <Navigate to="./change-profile" />
//       },
//       {
//         path: 'change-profile',
//         lazy: async () => {
//           const { default: Profile } = await import('../../pages/Profile/Profile');
//           // const { default: PlayerLimit } = await import(
//           //   '../../pages/users/player/ViewOnlyPlayerLimit'
//           // );
//           return {
//             Component: () => (
//               <>
//                 <PrivateRoute permission={PERMISSIONS.USER.LIST}>
//                   <Profile />
//                 </PrivateRoute>
//                 {/* <PrivateRoute permission={PERMISSIONS.USER.USER_LEVEL_LIMITS}>
//                   <PlayerLimit />
//                 </PrivateRoute> */}
//               </>
//             )
//           };
//         }
//       },
//       {
//         path: 'change-password',
//         lazy: async () => {
//           const { default: ChangePassword } = await import('../../pages/Profile/ChangePassword');
//           return {
//             Component: () => (
//               <PrivateRoute permission={PERMISSIONS.USER.USER_LEVEL_LIMITS}>
//                 <ChangePassword />
//               </PrivateRoute>
//             )
//           };
//         }
//       }
//     ]
//   }
// ];

// export default profileRoute;
