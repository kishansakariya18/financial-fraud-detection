import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
// import { Navigate } from 'react-router';

export const paymentProviderRoute = [
  {
    path: 'payment-provider',
    lazy: async () => {
      const { default: PaymentProviderList } = await import(
        '../../pages/payment-provider/list/list'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PAYMENT_PROVIDER.VIEW}>
            <PaymentProviderList />
          </PrivateRoute>
        )
      };
    }
  }
  // {
  //   path: 'payment-provider/:auditLogID/view',
  //   lazy: async () => {
  //     const { default: ViewPage } = await import('../../pages/payment-provider/ViewDetails');
  //     return {
  //       Component: () => (
  //         <PrivateRoute permission={PERMISSIONS.EMAIL_TEMPLATE.LIST}>
  //           <ViewPage />
  //         </PrivateRoute>
  //       )
  //     };
  //   }
  // }
];

export default paymentProviderRoute;
