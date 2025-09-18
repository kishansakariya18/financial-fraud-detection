// Local Imports
import { DynamicLayout } from 'app/layouts/DynamicLayout';
import AuthGuard from 'middleware/AuthGuard';
import AdminRouteGuard from './AdminRouteGuard';
import AgentRouteGuard from './AgentRouteGuard';
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
import layoutThemeRoute from './routes/layout-theme.route';
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
          children: [
            ...dashboardRoute,
            ...adminRoute,
            ...bannerRoute,
            ...playerRoutes,
            ...supervisorRoute,
            ...callingAgentsRoute,
            ...roleRoutes,
            ...auditlogsRoutes,
            ...platformRoute,
            ...countryRoutes,
            ...reportsRoutes,
            ...paymentRoute,
            ...userKycRoute,
            ...casinoRoutes,
            ...currenciesRoutes,
            ...affiliateRoutes,
            ...segmentationRoutes,
            ...emailTemplateRoute,
            ...promocodeRoute,
            ...pagesRoute,
            ...crmRoute,
            ...layoutThemeRoute,
            ...homeCategoryRoute,
            ...tenantRoute,
            ...bonusManagementRoute,
            ...bankRoute,
            ...userManualDepositTransactionRoute,
            ...userClass,
            ...rateLimitRulesRoute,
            ...registrationFieldsRoute,
            ...siteConfigurationRoutes,
            ...blacklistRoutes,
            ...releaseNotesRoutes,
            ...responsibleGamblingRoute
          ]
        },
        // Agent-only routes - centrally protected with AgentRouteGuard
        {
          Component: AgentRouteGuard,
          children: [...onlyCallingAgentRoutes]
        },
        // Shared routes accessible by both admin and agent
        ...profileRoute
      ]
    }
  ]
};

export { protectedRoutes };
