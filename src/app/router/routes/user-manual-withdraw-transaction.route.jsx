import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const userManualWithdrawTransactionRoute = [
  {
    path: 'user-manual-withdraw-transaction',
    lazy: async () => {
      const { default: List } =
        await import('../../pages/user-manual-withdraw-transaction/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PAYMENT.MANUAL_WITHDRAW_VIEW}>
            <List />
          </PrivateRoute>
        )
      };
    }
  }
];

export default userManualWithdrawTransactionRoute;
