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
  },
  {
    path: 'bank/add',
    lazy: async () => {
      const { default: AddBankDeposit } = await import(
        '../../pages/manual-bank-deposit/AddBankDeposit'
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
    path: 'bank/:id/edit',
    lazy: async () => {
      const { default: EditBankDeposit } = await import(
        '../../pages/manual-bank-deposit/EditBankDeposit'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANK.UPDATE}>
            <EditBankDeposit />
          </PrivateRoute>
        )
      };
    }
  }
];

export default bankRoute;
