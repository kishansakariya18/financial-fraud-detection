import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const paymentRoute = [
  {
    path: 'payment',
    lazy: async () => {
      const { default: CreatePayment } = await import('../../pages/payment/CreatePayment');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PAYMENT.VIEW}>
            <CreatePayment />
          </PrivateRoute>
        )
      };
    }
  }
];

export default paymentRoute;
