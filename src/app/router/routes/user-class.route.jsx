import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
export const userClasseRoute = [
  {
    path: '/user-class',
    lazy: async () => {
      const { default: UserClass } = await import('../../pages/user-class/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS.LIST}>
            <UserClass />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/user-class/create',
    lazy: async () => {
      const { default: CreateUserClass } = await import('../../pages/user-class/CreateUserClass');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS.CREATE}>
            <CreateUserClass />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/user-class/:userClassUID/edit',
    lazy: async () => {
      const { default: EditUserClass } = await import('../../pages/user-class/EditUserClass');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS.EDIT}>
            <EditUserClass />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/user-class/:userClassUID/limits',
    lazy: async () => {
      const { default: Limits } = await import('../../pages/user-class/limits/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS.LIMITS}>
            <Limits />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/user-class/:userClassID/:userClassLimitUID/limits/edit',
    lazy: async () => {
      const { default: EditUserClassLimit } = await import(
        '../../pages/user-class/limits/EditUserClassLimit'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS_LIMIT.EDIT}>
            <EditUserClassLimit />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/user-class/:userClassUID/limits/create',
    lazy: async () => {
      const { default: CreateUserClassLimit } = await import(
        '../../pages/user-class/limits/CreateUserClassLimit'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS_LIMIT.CREATE}>
            <CreateUserClassLimit />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/user-class/:id/assign-bank',
    lazy: async () => {
      const { default: AssignedBanks } = await import(
        '../../pages/user-class/assigned-banks/AssignedBanks'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS.ASSIGN_BANK}>
            <AssignedBanks />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/user-class/:id/assign-bank/add',
    lazy: async () => {
      const { default: BankList } = await import('../../pages/user-class/assigned-banks/BankList');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS.ASSIGN_BANK}>
            <BankList />
          </PrivateRoute>
        )
      };
    }
  }
];
export default userClasseRoute;
