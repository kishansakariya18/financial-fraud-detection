// Local Imports
import { DynamicLayout } from 'app/layouts/DynamicLayout';
import AuthGuard from 'middleware/AuthGuard';
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
import affiliateRoutes from './routes/affiliate.route';
import segmentationRoutes from './routes/segmentation.route';
import emailTemplateRoute from './routes/email-template.route';
import promocodeRoute from './routes/promocode.route';
import pagesRoute from './routes/pages.route';
import crmRoute from './routes/crm.route';
import homeCategoryRoute from './routes/home-category.route';

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: 'protected',
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        ...dashboardRoute,
        ...adminRoute,
        ...playerRoutes,
        ...roleRoutes,
        ...auditlogsRoutes,
        ...platformRoute,
        ...countryRoutes,
        ...reportsRoutes,
        ...paymentRoute,
        ...userKycRoute,
        ...casinoRoutes,
        ...affiliateRoutes,
        ...segmentationRoutes,
        ...emailTemplateRoute,
        ...promocodeRoute,
        ...pagesRoute,
        ...crmRoute,
        ...homeCategoryRoute
      ]
    }
  ]
};

export { protectedRoutes };
