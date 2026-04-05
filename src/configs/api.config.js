import { PLATFORM_TYPE } from 'constants/app.constant';

export const apiConfig = {
  baseURL: {
    API_BASE_URL: import.meta.env.VITE_API_URL,
    S3_URL: import.meta.env.VITE_S3_URL,
    AI_CHAT_URL: import.meta.env.VITE_AI_CHAT_URL
  },
  platformType: import.meta.env.VITE_PLATFORM_TYPE || PLATFORM_TYPE.B2C, // b2b (Business to Business) or b2c(Business to Customer)
  endPoints: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      RESENDOTP: '/admin/admin/auth/resend-otp',
      CHANGE_PASSWORD: '/admin/admin/auth/change-password',
      VALIDATE_RESET_PASSWORD: '/admin/admin/auth/validate-reset-password',
      RESET_PASSWORD: '/admin/admin/auth/reset-password'
    },
    AUTH_AGENT: {
      VALIDATE: '/agent/auth/validate',
      VERIFYOTP: '/agent/auth/login',
      RESENDOTP: '/agent/auth/resend-otp',
      CHANGE_PASSWORD: '/agent/auth/change-password',
      VALIDATE_RESET_PASSWORD: '/agent/auth/validate-reset-password',
      RESET_PASSWORD: '/agent/auth/reset-password',
      LOGOUT: '/agent/auth/logout'
    },
    ROLES: {
      LIST: '/admin/admin/roles/list',
      PERMISSION_LIST: '/admin/admin/roles/permission-list',
      SUBMIT: '/admin/admin/roles/add-role',
      DETAIL: '/admin/admin/roles/detail/:rolePermissionId',
      EDIT: '/admin/admin/roles/update',
      DELETE: '/admin/admin/roles/delete'
    },
    RESET_PASSWORD: '/admin/admin/auth/reset-password',

    AUDIT_LOGS: {
      VIEW: '/notifications/admin/audit-logs/list',
      DETAIL: '/notifications/admin/audit-logs/view/:Id'
    },
    USER: {
      ALL_TRANSACTION_LIST: '/transactions',
      CATEGORIES: '/categories',
      /** Optional: backend may expose system/built-in categories here; otherwise derived from list payload */
      CATEGORIES_SYSTEM: '/categories/system'
    },
    /** User-scoped fraud / transaction analytics (base path /api/v1/analytics) */
    ANALYTICS: {
      INCOME_VS_EXPENSE: '/analytics/income-vs-expense',
      TRANSACTIONS: '/analytics/transactions',
      FRAUD: '/analytics/fraud',
      DASHBOARD: '/analytics/dashboard',
      REPORT: '/analytics/report'
    },
    /** Platform admin (role ADMIN) — fraud product admin dashboard */
    ADMIN_FRAUD: {
      DASHBOARD: '/admin/dashboard'
    },
    ADMIN_USER: {
      ADMIN_LIST: '/admin/admin/admin/list',
      ADMIN_CHANGE_STATUS: '/admin/admin/admin/:adminId/change-status',
      ADMIN_ROLE_LIST: '/admin/admin/admin/role/list',
      ADMIN_CREATE: '/admin/admin/admin/create',
      ADMIN_DELETE: `/admin/admin/admin/:adminId/delete`,
      ADMIN_DETAIL: '/admin/admin/admin/:adminId/details',
      ADMIN_LOGIN: '/admin/admin/login',
      ADMIN_LOGIN_HISTORY: '/admin/admin/admin/:adminID/login-history',
      ADMIN_DASHBOARD: '/dashboard',
      ADMIN_CHANGE_PASSWORD: '/admin/auth/update-password',
      ADMIN_APPSETTINGS: '/config/admin/config/app-setting',
      ADMIN_CHECK_PASSWORD: '/admin/admin/check-password',
      ADMIN_PERMISSION: '/admin/admin/admin/permissions',
      ADMIN_EDIT: '/admin/admin/admin/edit',
      UPDATE_PROFILE: '/admin/admin/update-profile',
      ADMIN_SUMMARY: '/admin/admin/admin/summary',
      COUNTRY_LIST: '/config/admin/config/countries'
    },
    DASHBOARD: {
      LIST: '/admin/dashboard',
      USER_CARDS: '/users/admin/dashboard/get-cards',
      WALLET_CARDS: '/wallet/admin/dashboard/get-cards',
      BET_CARDS: '/bets/admin/dashboard/get-cards',
      GAME_CARDS: '/games/admin/dashboard/get-cards',
      DEPOSIT_STATS: '/wallet/admin/dashboard/deposit-stats',
      WITHDRAW_STATS: '/wallet/admin/dashboard/withdraw-stats',
      GGR_REPORT: '/bets/admin/dashboard/ggr-report',
      LOGGED_IN_PLAYERS: '/users/admin/dashboard/logged-in-players',
      ACTIVE_PLAYERS: '/bets/admin/dashboard/active-players',
      DEMOGRAPHIC_REPORT: '/users/admin/dashboard/demographic-report',
      KPI_SUMMARY: '/bets/admin/dashboard/kpi-summary',
      CASINO_STATS: '/bets/admin/dashboard/casino-stats',
      TOP_PLAYERS: '/bets/admin/dashboard/top-players',
      TOP_GAMES: '/bets/admin/dashboard/top-games',
      LAST_DEPOSITOR: '/wallet/admin/dashboard/last-depositor',
      LAST_WITHDRAWAL: '/wallet/admin/dashboard/last-withdrawer',
      LAST_SIGNUP: '/users/admin/dashboard/last-signup'
    }
  }
};

export default apiConfig;
