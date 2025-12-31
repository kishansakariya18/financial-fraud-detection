// Import Dependencies
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_COLLAPSE, PERMISSIONS } from 'constants/app.constant';
// import { country } from './country';
import { RateLimitRules } from './rateLimitRules';
import { appSettings } from './app-settings';
import emailProvider from './email-provider';
import kycProvider from './kyc-provider';
import smsProvider from './sms-provider';
import paymentProviderConfig from './payment-provider-config';

import { passwordManager } from './password-manager';

export const siteConfiguration = {
  id: 'site_configuration',
  type: NAV_TYPE_COLLAPSE,
  path: '/site-configuration',
  title: 'Site Configuration',
  transKey: 'site_configuration',
  Icon: Cog6ToothIcon,
  permission: [
    PERMISSIONS.APP_SETTING.EDIT,
    PERMISSIONS.RATE_LIMIT_RULES.LIST,
    PERMISSIONS.EMAIL_PROVIDER.LIST,
    PERMISSIONS.SMS_PROVIDER.LIST,
    PERMISSIONS.KYC_PROVIDER.LIST,
    PERMISSIONS.PAYMENT_PROVIDER.LIST
  ],
  childs: [
    // country,
    appSettings,
    passwordManager,
    RateLimitRules,
    emailProvider,
    kycProvider,
    smsProvider,
    paymentProviderConfig
  ]
};
