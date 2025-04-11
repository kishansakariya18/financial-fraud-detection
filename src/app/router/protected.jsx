// Local Imports
import { DynamicLayout } from 'app/layouts/DynamicLayout';
import AuthGuard from 'middleware/AuthGuard';
import dashboardRoute from './routes/dashboard.route';
import adminRoute from './routes/admin.route';
import playerRoutes from './routes/player.route';
import roleRoutes from './routes/role.route';
import platformRoute from './routes/platform.route';
import countryRoutes from './routes/country.route';
import reportsRoutes from './routes/betSlip.route';
import paymentRoute from './routes/payment.route';
import userKycRoute from './routes/user-kyc.routes';
import casinoRoutes from './routes/casino.route';
import affiliateRoutes from './routes/affiliate.route';

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
        ...platformRoute,
        ...countryRoutes,
        ...reportsRoutes,
        ...paymentRoute,
        ...userKycRoute,
        ...casinoRoutes,
        ...affiliateRoutes
      ]
    }
  ]
};

export { protectedRoutes };
