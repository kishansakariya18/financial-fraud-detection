import { PLATFORM_TYPE } from 'constants/app.constant';
import PrivateRoute from '../private';

export const siteConfigurationRoutes = [
  {
    path: 'site-configuration/app-settings',
    lazy: async () => {
      const { default: ApplicationSettings } = await import(
        '../../pages/site-configuration/app-settings'
      );
      return {
        Component: () => <ApplicationSettings />
      };
    }
  },
  {
    path: 'site-configuration/email-provider',
    lazy: async () => {
      const { default: EmailProvider } = await import('../../pages/email-provider/list/list');
      return {
        Component: () => <EmailProvider />
      };
    }
  },
  {
    path: 'site-configuration/kyc-provider',
    lazy: async () => {
      const { default: KYCProvider } = await import('../../pages/kyc-provider/list/list');
      return {
        Component: () => (
          <PrivateRoute allowedPlatforms={PLATFORM_TYPE.B2C}>
            <KYCProvider />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'site-configuration/sms-provider',
    lazy: async () => {
      const { default: SMSProvider } = await import('../../pages/sms-provider/list/list');
      return {
        Component: () => <SMSProvider />
      };
    }
  },
  {
    path: 'site-configuration/payment-provider-config',
    lazy: async () => {
      const { default: PaymentProvider } = await import(
        '../../pages/payment-provider-config/list/list'
      );
      return {
        Component: () => (
          <PrivateRoute allowedPlatforms={[PLATFORM_TYPE.B2C]}>
            <PaymentProvider />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'site-configuration/email-provider/edit/:providerUID',
    lazy: async () => {
      const { default: EditEmailProvider } = await import(
        '../../pages/email-provider/EditProvider'
      );
      return {
        Component: () => <EditEmailProvider />
      };
    }
  },
  {
    path: 'site-configuration/sms-provider/edit/:providerUID',
    lazy: async () => {
      const { default: EditEmailProvider } = await import('../../pages/sms-provider/EditProvider');
      return {
        Component: () => <EditEmailProvider />
      };
    }
  },
  {
    path: 'site-configuration/kyc-provider/edit/:providerUID',
    lazy: async () => {
      const { default: EditEmailProvider } = await import('../../pages/kyc-provider/EditProvider');
      return {
        Component: () => <EditEmailProvider />
      };
    }
  },
  {
    path: 'site-configuration/payment-provider-config/edit/:providerUID',
    lazy: async () => {
      const { default: EditEmailProvider } = await import(
        '../../pages/payment-provider-config/EditProvider'
      );
      return {
        Component: () => <EditEmailProvider />
      };
    }
  }
];

export default siteConfigurationRoutes;
