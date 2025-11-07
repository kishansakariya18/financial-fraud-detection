import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const withdrawRoute = [
  {
    path: 'withdraw',
    lazy: async () => {
      const { default: WithdrawList } = await import('../../pages/manual-bank-withdraw/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANK.VIEW}>
            <WithdrawList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'withdraw/add',
    lazy: async () => {
      const { default: AddWithdraw } = await import('../../pages/manual-bank-withdraw/AddWithdraw');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANK.CREATE}>
            <AddWithdraw />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'withdraw/:id/edit',
    lazy: async () => {
      const { default: EditWithdraw } = await import(
        '../../pages/manual-bank-withdraw/EditWithdraw'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANK.UPDATE}>
            <EditWithdraw />
          </PrivateRoute>
        )
      };
    }
  }
];

export default withdrawRoute;
