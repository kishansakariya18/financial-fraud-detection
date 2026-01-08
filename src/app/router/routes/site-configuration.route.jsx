import { PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';
import PrivateRoute from '../private';

export const siteConfigurationRoutes = [
  {
    path: 'site-configuration/app-settings',
    lazy: async () => {
      const { default: ApplicationSettings } = await import(
        '../../pages/site-configuration/app-settings'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.APP_SETTING.EDIT}>
            <ApplicationSettings />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'site-configuration/email-provider',
    lazy: async () => {
      const { default: EmailProvider } = await import('../../pages/email-provider/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EMAIL_PROVIDER.LIST}>
            <EmailProvider />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'site-configuration/kyc-provider',
    lazy: async () => {
      const { default: KYCProvider } = await import('../../pages/kyc-provider/list/list');
      return {
        Component: () => (
          <PrivateRoute
            permission={PERMISSIONS.KYC_PROVIDER.LIST}
            allowedPlatforms={PLATFORM_TYPE.B2C}>
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
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SMS_PROVIDER.LIST}>
            <SMSProvider />
          </PrivateRoute>
        )
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
          <PrivateRoute
            permission={PERMISSIONS.PAYMENT_PROVIDER.LIST}
            allowedPlatforms={[PLATFORM_TYPE.B2C]}>
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
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.EMAIL_PROVIDER.EDIT}>
            <EditEmailProvider />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'site-configuration/sms-provider/edit/:providerUID',
    lazy: async () => {
      const { default: EditEmailProvider } = await import('../../pages/sms-provider/EditProvider');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SMS_PROVIDER.EDIT}>
            <EditEmailProvider />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'site-configuration/kyc-provider/edit/:providerUID',
    lazy: async () => {
      const { default: EditEmailProvider } = await import('../../pages/kyc-provider/EditProvider');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.KYC_PROVIDER.EDIT}>
            <EditEmailProvider />
          </PrivateRoute>
        )
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
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.PAYMENT_PROVIDER.EDIT}>
            <EditEmailProvider />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'site-configuration/password-manager',
    lazy: async () => {
      const { default: PasswordManager } = await import(
        '../../pages/site-configuration/password-manager'
      );
      return {
        Component: () => (
          <PrivateRoute>
            <PasswordManager />
          </PrivateRoute>
        )
      };
    }
  }
];

export default siteConfigurationRoutes;
