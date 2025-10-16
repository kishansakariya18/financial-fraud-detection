import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const userManualWithdrawTransactionRoute = [
  {
    path: 'user-manual-withdraw-transaction',
    lazy: async () => {
      const { default: List } = await import(
        '../../pages/user-manual-withdraw-transaction/list/list'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANK.VIEW}>
            <List />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'user-manual-withdraw-transaction/add',
    lazy: async () => {
      const { default: AddBankDeposit } = await import(
        '../../pages/user-manual-withdraw-transaction/AddBankDeposit'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANK.CREATE}>
            <AddBankDeposit />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'user-manual-withdraw-transaction/:id/edit',
    lazy: async () => {
      const { default: EditBankDeposit } = await import(
        '../../pages/user-manual-withdraw-transaction/EditBankDeposit'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANK.UPDATE}>
            <EditBankDeposit />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'user-manual-withdraw-transaction/view/:id',
    lazy: async () => {
      const { default: ViewWithdraw } = await import(
        '../../pages/user-manual-withdraw-transaction/View'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_MANUAL_DEPOSIT_TRANSACTION.VIEW}>
            <ViewWithdraw />
          </PrivateRoute>
        )
      };
    }
  }
];

export default userManualWithdrawTransactionRoute;
