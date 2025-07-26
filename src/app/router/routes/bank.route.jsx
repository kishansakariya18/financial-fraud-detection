import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
// import { Navigate } from 'react-router';

export const bankRoute = [
  {
    path: 'bank',
    lazy: async () => {
      const { default: BankList } = await import('../../pages/manual-bank-deposit/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANK.VIEW}>
            <BankList />
          </PrivateRoute>
        )
      };
    }
  }
];

export default bankRoute;
