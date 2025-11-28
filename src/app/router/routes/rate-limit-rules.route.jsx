import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const rateLimitRulesRoute = [
  {
    path: 'site-configuration/rate-limit-rules',
    lazy: async () => {
      const { default: RateLimitRuleList } = await import('../../pages/rate-limit-rules/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.RATE_LIMIT_RULES.LIST}>
            <RateLimitRuleList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'site-configuration/rate-limit-rules/edit/:rateLimitUID',
    lazy: async () => {
      const { default: EditRulesLimit } = await import(
        '../../pages/rate-limit-rules/EditRulesLimit'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.RATE_LIMIT_RULES.EDIT}>
            <EditRulesLimit />
          </PrivateRoute>
        )
      };
    }
  }
];

export default rateLimitRulesRoute;
