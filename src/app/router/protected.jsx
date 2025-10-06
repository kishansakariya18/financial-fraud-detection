// Local Imports
import { DynamicLayout } from 'app/layouts/DynamicLayout';
import AuthGuard from 'middleware/AuthGuard';
import AdminRouteGuard from './AdminRouteGuard';
import CallingAgentRouteGuard from './CallingAgentRouteGuard';
import dashboardRoute from './routes/dashboard.route';
import adminRoute from './routes/admin.route';
import playerRoutes from './routes/player.route';
import roleRoutes from './routes/role.route';
import auditlogsRoutes from './routes/auditlogs.route';
import platformRoute from './routes/platform.route';
import countryRoutes from './routes/country.route';
import reportsRoutes from './routes/reports.route';
import paymentRoute from './routes/payment.route';
import userKycRoute from './routes/player-kyc.routes';
import casinoRoutes from './routes/casino.route';
import currenciesRoutes from './routes/currencies.route';
import affiliateRoutes from './routes/affiliate.route';
import segmentationRoutes from './routes/segmentation.route';
import emailTemplateRoute from './routes/event-template.route';
import promocodeRoute from './routes/promocode.route';
import bonusCampaignRoute from './routes/bonus-campaign.route';
import pagesRoute from './routes/pages.route';
import crmRoute from './routes/crm.route';
import homeCategoryRoute from './routes/home-category.route';
import tenantRoute from './routes/tenant.route';
import profileRoute from './routes/profile.route';
import bonusManagementRoute from './routes/bonus-management.route';

import bannerRoute from './routes/banner.route';
import userClass from './routes/user-class.route';
import rateLimitRulesRoute from './routes/rate-limit-rules.route';
import registrationFieldsRoute from './routes/registration-fields.route.jsx';
import siteConfigurationRoutes from './routes/site-configuration.route';
import blacklistRoutes from './routes/blacklist.route';
import { bankRoute } from './routes/bank.route';
import { userManualDepositTransactionRoute } from './routes/user-manual-deposit-transaction.route';
import { releaseNotesRoutes } from './routes/release-notes.route';
import { supervisorRoute } from './routes/supervisor.route';
import responsibleGamblingRoute from './routes/responsible-gambling.route.jsx';

import onlyCallingAgentRoutes from './routes/calling-agents.route';
import { callingAgentsRoute } from './routes/supervisor.route';
import b2bAgentRoutes from './routes/b2b-agent/b2b-agent-routes';
import B2BAgentRouteGuard from './B2BAgentRouteGuard';
import layoutThemeRoute from './routes/layout-theme.route';
import b2bAgentAdminRoutes from './routes/b2b-agent/b2b-agent-for-admin';
import affiliatesRoutes from './routes/affiliates.route';
import globalCommissionSettingRoute from './routes/global-commission-setting.route';
import faqRoutes from './routes/faq.route';
import { platformGuard } from './PlatformRouteGuard';
import { Outlet } from 'react-router';
import { PLATFORM_TYPE } from 'constants/app.constant';
// ----------------------------------------------------------------------

const protectedRoutes = {
  id: 'protected',
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        // Admin routes - centrally protected with AdminRouteGuard
        {
          Component: AdminRouteGuard,
          element: <Outlet />,
          children: [
            // Routes available for both B2B and B2C platforms
            ...dashboardRoute,
            ...adminRoute,
            ...bannerRoute,
            ...playerRoutes,
            ...roleRoutes,
            ...auditlogsRoutes,
            ...platformRoute,
            ...countryRoutes,
            ...reportsRoutes,
            ...userKycRoute,
            ...casinoRoutes,
            ...segmentationRoutes,
            ...emailTemplateRoute,
            ...promocodeRoute,
            ...pagesRoute,
            ...crmRoute,
            ...layoutThemeRoute,
            ...homeCategoryRoute,
            ...tenantRoute,
            ...bonusManagementRoute,
            ...userClass,
            ...rateLimitRulesRoute,
            ...siteConfigurationRoutes,
            ...blacklistRoutes,
            ...releaseNotesRoutes,
            ...responsibleGamblingRoute,
            ...faqRoutes,
            // B2C-only admin routes
            {
              loader: platformGuard([PLATFORM_TYPE.B2C]),
              element: <Outlet />,
              children: [
                ...supervisorRoute,
                ...callingAgentsRoute,
                ...currenciesRoutes,
                ...affiliateRoutes,
                ...affiliatesRoutes,
                ...userManualDepositTransactionRoute,
                ...bankRoute,
                ...registrationFieldsRoute,
                ...paymentRoute,
                ...bonusCampaignRoute,
                ...globalCommissionSettingRoute
              ]
            },

            // B2B-only admin routes
            {
              loader: platformGuard([PLATFORM_TYPE.B2B]),
              element: <Outlet />,
              children: [...b2bAgentAdminRoutes]
            }
          ]
        },
        // Calling Agent-only routes - centrally protected with CallingAgentRouteGuard (B2B only)
        {
          Component: CallingAgentRouteGuard,
          children: [
            {
              loader: platformGuard([PLATFORM_TYPE.B2C]),
              element: <Outlet />,
              children: [...onlyCallingAgentRoutes]
            }
          ]
        },

        // B2B Agent routes - centrally protected with B2BAgentRouteGuard (B2B only)
        {
          Component: B2BAgentRouteGuard,
          children: [
            {
              loader: platformGuard([PLATFORM_TYPE.B2B]),
              element: <Outlet />,
              children: [...b2bAgentRoutes]
            }
          ]
        },
        ...profileRoute
      ]
    }
  ]
};

export { protectedRoutes };
