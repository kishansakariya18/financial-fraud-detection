import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
// import { Navigate } from 'react-router';

export const userManualDepositTransactionRoute = [
  {
    path: 'user-manual-deposit-transaction',
    lazy: async () => {
      const { default: BankList } =
        await import('../../pages/user-manual-deposit-transaction/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANK.VIEW}>
            <BankList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'user-manual-deposit-transaction/add',
    lazy: async () => {
      const { default: AddBankDeposit } =
        await import('../../pages/user-manual-deposit-transaction/AddBankDeposit');
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
    path: 'user-manual-deposit-transaction/:id/edit',
    lazy: async () => {
      const { default: EditBankDeposit } =
        await import('../../pages/user-manual-deposit-transaction/EditBankDeposit');
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
    path: 'user-manual-deposit-transaction/view/:id',
    lazy: async () => {
      const { default: ViewBankDeposit } =
        await import('../../pages/user-manual-deposit-transaction/View');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_MANUAL_DEPOSIT_TRANSACTION.VIEW}>
            <ViewBankDeposit />
          </PrivateRoute>
        )
      };
    }
  }
];

export default userManualDepositTransactionRoute;
