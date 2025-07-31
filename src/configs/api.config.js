export const apiConfig = {
  baseURL: {
    API_BASE_URL: import.meta.env.VITE_API_URL,
    S3_URL: import.meta.env.VITE_S3_URL,
    AI_CHAT_URL: import.meta.env.VITE_AI_CHAT_URL
  },
  endPoints: {
    AUTH: {
      VALIDATE: '/admin/admin/auth/validate',
      VERIFYOTP: '/admin/admin/auth/login',
      RESENDOTP: '/admin/admin/auth/resend-otp',
      CHANGE_PASSWORD: '/admin/admin/auth/change-password',
      VALIDATE_RESET_PASSWORD: '/admin/admin/auth/validate-reset-password',
      RESET_PASSWORD: '/admin/admin/auth/reset-password'
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
      VIEW: '/notify/admin/audit-logs/list',
      DETAIL: '/notify/admin/audit-logs/view/:Id'
    },
    PAGE: {
      LIST: '/content/admin/pages/list',
      ADD: '/content/admin/pages/add',
      TOGGLE_STATUS: '/content/admin/pages/:pageID/change-status',
      DELETE: '/content/admin/pages/:pageID/delete',
      DETAIL: '/content/admin/pages/detail',
      UPDATE: '/content/admin/pages/update'
    },
    USER: {
      DETAIL: '/users/admin/users/detail/:userUID',
      LIST: '/users/admin/users/list',
      REFERRAL_LIST: '/users/admin/users/referral/:userID',
      FUND: '/users/admin/users/fund',
      TRANSACTION_LIST: '/users/admin/users/transaction-list',
      TDS_SUMMARY_TRANSACTION_LIST: '/users/admin/users/tds-summary-transaction-list',
      TRANSACTION_DETAIL: '/users/admin/users/transaction-detail',
      CHANGE_STATUS: '/users/admin/users/change-status',
      REST_BANK_COUNT: '/users/admin/users/reset-bank-request-count',
      UPDATE_RISK_MANAGEMENT: '/users/admin/users/update-user-risk-management/:userID',
      ALL_TRANSACTION_LIST: '/users/admin/users/all-transaction-list',
      GET_COMMENT: '/users/admin/users/get-comment',
      UPDATE_COMMENT: '/users/admin/users/update-comment',
      LOGIN_HISTORY: '/users/admin/users/:userID/login-history',
      GET_COMMENT_DETAIL: '/users/admin/users/get-comment-detail',
      ADD_COMMENT: '/users/admin/users/add-comment',
      DELETE_COMMENT: '/users/admin/users/delete-comment',
      CHANE_PLAYER_FUND_PASSWORD: '/admin/user/change-manage-fund-password',
      SUMMARY: '/users/admin/users/summary',
      USER_SUMMARY: '/users/admin/users/summary',
      COUNTRY_LIST: '/config/admin/config/countries',
      SEGMENTATION_LIST: '/bonus/admin/segmentation/list'
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
      ADMIN_COUNTRY_LIST: '/admin/admin/countries',
      ADMIN_SUMMARY: '/admin/admin/admin/summary'
    },
    TENANT: {
      LIST: '/config/admin/tenant/list',
      CHANGE_STATUS: '/config/admin/tenant/:tenantUID/change-status',
      CREATE: '/config/admin/tenant/create'
    },
    DASHBOARD: {
      LIST: '/admin/dashboard',
      CARDS: '/admin/dashboard/cards',
      DEPOSIT_STATS: '/admin/dashboard/deposit-stats',
      WITHDRAW_STATS: '/admin/dashboard/withdraw-stats',
      GGR_REPORT: '/admin/dashboard/ggr-report',
      LOGGED_IN_PLAYERS: '/admin/dashboard/logged-in-players',
      ACTIVE_PLAYERS: '/admin/dashboard/active-players',
      DEMOGRAPHIC_REPORT: '/admin/dashboard/demographic-report',
      KPI_SUMMARY: '/admin/dashboard/kpi-summary',
      CASINO_STATS: '/admin/dashboard/casino-stats',
      TOP_PLAYERS: '/admin/dashboard/top-players',
      TOP_GAMES: '/admin/dashboard/top-games',
      LAST_DEPOSITOR: '/admin/dashboard/last-depositor',
      LAST_WITHDRAWAL: '/admin/dashboard/last-withdrawer',
      LAST_SIGNUP: '/admin/dashboard/last-signup'
    },
    DEPOSIT_PROMOCODE: {
      PROMOCODE_LIST: '/bonus/admin/v1/deposit-promocode/list',
      PROMOCODE_DETAIL: '/bonus/admin/v1/deposit-promocode/:promocodeId/details',
      PROMOCODE_CREATE: '/bonus/admin/v1/deposit-promocode/create',
      PROMOCODE_CHANGE_STATUS: '/bonus/admin/v1/deposit-promocode/:promocodeId/change-status',
      PROMOCODE_HISTORY: '/bonus/admin/v1/deposit-promocode/:promocodeId/history',
      PROMOCODE_SEGMENTATION: '/bonus/admin/v1/deposit-promocode/:promocodeId/segmentation',
      PROMOCODE_UPLOAD_SEGMENTATION: '/bonus/admin/v1/deposit-promocode/:promocodeId/segmentation',
      PROMOCODE_REMOVE_SEGMENTATION: '/bonus/admin/v1/deposit-promocode/:promocodeId/segmentation',
      PROMOCODE_DELETE: '/bonus/admin/v1/deposit-promocode/:promocodeId',
      SUMMARY: '/bonus/admin/v1/deposit-promocode/summary'
    },
    BANNER: {
      BANNER_LIST: '/content/admin/banner/list',
      BANNER_CHANGE_STATUS: `/content/admin/banner/:bannerId/change-status`,
      BANNER_CREATE: '/content/admin/banner/create',
      BANNER_DELETE: `/content/admin/banner/:bannerId/delete`,
      BANNER_DETAIL: `/content/admin/banner/:bannerId/details`,
      BANNER_EDIT: `/content/admin//banner/:bannerId/edit`,
      BANNER_REORDER: '/content/admin/banner/reorder'
    },
    AFFILIATE: {
      AFFILIATE_LIST: '/affiliates/admin/affiliates',
      CHANGE_STATUS: '/affiliates/admin/affiliates/change-status',
      CREATE: '/affiliates/admin/affiliates/create',
      AFFILIATE_DETAIL: '/affiliates/admin/affiliates/:affiliateId/details',
      AFFILIATE_EDIT: '/affiliates/admin/affiliates/edit',
      USER_JOINED_LIST: '/affiliates/admin/affiliates/user-joined',
      TRANSACTION_LIST: '/affiliates/admin/affiliates/transactions',
      PAYOUT_LIST: '/affiliates/admin/affiliates/payout-histories',
      UPDATE_PAYOUT: '/affiliates/admin/affiliates/update-payout',
      FUND: '/affiliates/admin/affiliates/fund',
      AFFILIATE_LOGIN_HISTORY: '/affiliates/admin/affiliates/:affiliateID/login-history',
      CHANGE_AFFILIATE_FUND_PASSWORD: '/affiliates/admin/affiliate/change-manage-fund-password',
      SUMMARY: '/affiliates/admin/affiliates/summary'
    },
    SETTINGS: {
      USER_KYC: {
        LIST: '/users/admin/kyc/doc/list',
        DETAILS: '/users/admin/kyc/doc/:documentId/details',
        UPDATE: '/users/admin/kyc/update'
      }
    },
    EMAIL_TEMPLATE: {
      LIST: '/notifications/admin/email-template/list',
      ADD: '/notifications/admin/email-template/add',
      DETAIL: '/notifications/admin/email-template/detail',
      UPDATE: '/notifications/admin/email-template/update',
      STATUS: '/notifications/admin/email-template/status'
    },
    REFERRAL_OFFER: {
      LIST: '/bonus/admin/v1/offers/list',
      UPDATE: '/bonus/admin/v1/offers/update'
    },
    SEGMENTATION: {
      LIST: '/bonus/admin/segmentation/list',
      ALL_LIST: '/bonus/admin/segmentation/allList',
      DETAIL: '/bonus/admin/segmentation/:segmentationUID/details',
      ADD_EDIT: '/bonus/admin/segmentation/add-edit',
      COUNTRY_LIST: '/bonus/admin/segmentation/countries',
      CHANGE_STATUS: '/bonus/admin/segmentation/:segmentationUID/change-status',
      USER_LIST: '/bonus/admin/segmentation/player-list',
      REFRESH_USER_LIST: '/bonus/admin/segmentation/:segmentationId/refresh'
    },
    // COUNTRY: {
    //   LIST: '/admin/country/list',
    //   SUMMARY: '/admin/country/summary',
    //   CHANGE_STATUS: '/admin/country/:countryId/change-status'
    // },
    COUNTRY: {
      LIST: '/config/admin/country/list',
      SUMMARY: '/config/admin/country/summary',
      CHANGE_STATUS: '/config/admin/country/:countryId/change-status'
    },
    RISK_MANAGEMENT: {
      LIST: '/config/admin/risk-management/list',
      UPDATE: '/config/admin/update-risk-management'
    },
    CATEGORY: {
      LIST: '/games/admin/casino-management/category/list',
      SUMMARY: '/games/admin/casino-management/category/summary',
      CREATE: '/games/admin/casino-management/category/create',
      EDIT: '/games/admin/casino-management/category/:categoryId/edit',
      DELETE: '/games/admin/casino-management/category/:categoryId/delete',
      CHANGE_STATUS: '/games/admin/casino-management/category/:categoryId/change-status'
    },
    PROVIDER: {
      ALL_LIST: '/games/admin/casino-management/provider/all',
      LIST: '/games/admin/casino-management/provider/list',
      SUMMARY: '/games/admin/casino-management/provider/summary',
      CREATE: '/games/admin/casino-management/provider/create',
      EDIT: '/games/admin/casino-management/provider/:providerId/edit',
      DELETE: '/games/admin/casino-management/provider/:providerId/delete',
      CHANGE_STATUS: '/games/admin/casino-management/provider/:providerId/change-status',
      RESTRICTED_COUNTRY_LIST:
        '/games/admin/casino-management/provider/:providerId/restricted-country/list',
      COUNTRY_LIST: '/games/admin/casino-management/provider/:providerId/country/list',
      ADD_RESTRICTED_COUNTRY:
        '/games/admin/casino-management/provider/:providerId/restricted-country/add',
      REMOVE_RESTRICTED_COUNTRY:
        '/games/admin/casino-management/provider/:providerId/restricted-country/delete'
    },
    GAME: {
      LIST: '/games/admin/casino-management/games/list',
      SUMMARY: '/games/admin/casino-management/games/summary',
      DETAILS: '/games/admin/casino-management/games/:gameUID/details',
      CREATE: '/games/admin/casino-management/games/create',
      EDIT: '/games/admin/casino-management/games/:gameId/edit',
      DELETE: '/games/admin/casino-management/games/:gameId/delete',
      PROVIDER_LIST: '/games/admin/casino-management/games/providers',
      CATEGORY_LIST: '/games/admin/casino-management/category/list',
      GET_GAME_SEGMENTATION: '/games/admin/casino-management/games/:gameId/segmentation',
      ADD_GAME_SEGMENTATION: '/games/admin/casino-management/games/:gameId/segmentation'
    },
    REPORTS: {
      BETSLIP: '/admin/reports/betslip-transactions',
      BETSLIP_EXPORT: '/admin/reports/betslip',
      TRANSACTIONS: '/admin/reports/get-transactions',
      TRANSACTIONS_EXPORT: '/admin/reports/transactions/export',
      PLAYER_BALANCE_LIST: '/admin/reports/player-balance/list',
      PLAYER_BALANCE_EXPORT: '/admin/reports/player-balance/export',
      DEPOSIT_BONUS_LIST: '/admin/reports/deposit-bonus/list',
      DEPOSIT_BONUS_EXPORT: '/admin/reports/deposit-bonus/export'
    },
    CRM: {
      SEND: '/admin/crm/sendNotification'
    },
    HOME_PAGE: {
      HOME_CATEGORY_LIST: '/config/admin/home-page/home-category/list',
      CHANGE_HOME_CATEGORY_STATUS:
        '/config/admin/home-page/home-category/:homeCategoryId/change-status',
      CHANGE_HOME_GAME_STATUS:
        '/config/admin/home-page/home-category/home-game/:homePageGameId/change-status',
      GET_CATEGORY: '/config/admin/home-page/home-category/get-category',
      EDIT_HOME_CATEGORY: '/config/admin/home-page/home-category/edit-category',
      HOME_GAME_LIST: '/config/admin/home-page/home-category/home-game/list',
      ADD_HOME_GAME_LIST: '/config/admin/home-page/home-category/home-game/add-game-list',
      ADD_HOME_GAMES: '/config/admin/home-page/home-category/home-game/add-games',
      REORDER_CATEGORY: '/config/admin/home-page/home-category/reorder-category',
      DELETE_THEME: '/config/admin/home-page/appearance/delete',
      REORDER_GAMES: '/config/admin/home-page/home-category/home-game/reorder-games',
      DELETE_HOME_GAME: '/config/admin/home-page/home-category/home-game/:homePageGameId/delete',
      ADD_APPEARANCE: '/config/admin/home-page/appearance/add',
      CHANGE_APPEARANCE_STATUS: '/config/admin/home-page/appearance/change-status',
      APPEARANCE_LIST: '/config/admin/home-page/appearance/list'
    },
    PAYMENT_PROVIDER: {
      VIEW: '/payments/admin/payment-provider/list',
      STATUS: '/payments/admin/payment-provider/change-status'
    },
    GEORESTRICTION: {
      COUNTRY_LIST: '/config/admin/country/restrictions/list',
      BLOCKED_MODULES: '/config/admin/country/:countryId/restrictions/modules/list',
      BLOCKED_PROVIDERS: '/config/admin/country/:countryId/restrictions/providers/list',
      BLOCK_MODULE: '/config/admin/country/:countryId/restrict-country-module',
      BLOCK_PROVIDER: '/config/admin/country/:countryId/restrict-country-provider',
      BLOCK_COUNTRY: '/config/admin/country/restrictions',
      UNBLOCK_COUNTRY: '/config/admin/country/restrictions/:countryId/unrestrict'
    },
    USER_CLASS: {
      LIST: '/users/admin/user-classes/list',
      CREATE: '/users/admin/user-classes/create',
      DETAIL: '/users/admin/user-classes/:userClassUID/detail',
      UPDATE: '/users/admin/user-classes/update',
      CHANGE_STATUS: '/users/admin/user-classes/:userClassUID/change-status',
      DELETE: '/users/admin/user-classes/:userClassUID/delete',
      MAPPED_BANK: '/payments/admin/deposit-bank/:userClassUID/mapped-bank-account/list',
      UNMAPPED_BANK: '/payments/admin/deposit-bank/:userClassUID/unmapped-bank-account/list',
      MAP_BANK: '/payments/admin/deposit-bank/:userClassUID/map-bank',
      UNMAP_BANK: '/payments/admin/deposit-bank/:userClassUID/unmap-bank'
    },
    USER_CLASS_LIMIT: {
      LIST: '/users/admin/user-class-limits/list',
      CREATE: '/users/admin/user-class-limits/create',
      DETAIL: '/users/admin/user-class-limits/:userClassLimitUID/detail',
      UPDATE: '/users/admin/user-class-limits/update',
      CHANGE_STATUS: '/users/admin/user-class-limits/:userClassLimitUID/change-status',
      DELETE: '/users/admin/user-class-limits/:userClassLimitUID/delete'
    },
    SEGMENTATION_LIMIT: {
      LIST: '/bonus/admin/segmentation-limits/list',
      CREATE: '/bonus/admin/segmentation-limits/create',
      DETAIL: '/bonus/admin/segmentation-limits/:segmentationLimitUID/detail',
      UPDATE: '/bonus/admin/segmentation-limits/update',
      CHANGE_STATUS: '/bonus/admin/segmentation-limits/:segmentationLimitUID/change-status',
      DELETE: '/bonus/admin/segmentation-limits/:segmentationLimitUID/delete'
    },
    RATE_LIMIT_RULES: {
      LIST: '/config/admin/rate-limit-rules/list',
      CHANGE_STATUS: '/config/admin/rate-limit-rules/:rateLimitUID/change-status'
    },
    BLACKLIST: {
      LIST: '/admin/blacklist/list',
      BLOCK: '/admin/blacklist/block',
      DELETE: '/admin/blacklist/:blacklistUID/delete'
    },
    BANK: {
      LIST: '/payments/admin/deposit-bank/list',
      CHANGE_STATUS: '/payments/admin/deposit-bank/:bankId/change-status',
      CREATE: '/payments/admin/deposit-bank/create',
      DETAIL: '/payments/admin/deposit-bank/:bankId/details',
      EDIT: '/payments/admin/deposit-bank/:bankId/edit',
      DELETE: '/payments/admin/deposit-bank/:bankId/delete'
    },
    USER_MANUAL_DEPOSIT_TRANSACTION: {
      LIST: '/payments/admin/user-bank-deposit/list',
      MANUAL_VERIFY: '/payments/admin/user-bank-deposit/:depositId/manual-deposit/verify',
      DETAIL: '/admin/user-bank-deposit/:depositId/details',
      EDIT: '/admin/user-bank-deposit/:depositId/edit',
      DELETE: '/admin/user-bank-deposit/:depositId/delete'
    },
    RELEASE_NOTES: {
      LIST: '/content/admin/release-note/list',
      CREATE: '/content/admin/release-note/create',
      DELETE: '/content/admin/release-note/:releaseNoteUID/delete',
      DETAIL: '/content/admin/release-note/:releaseNoteUID/details',
      CHANGE_STATUS: '/content/admin/release-note/:releaseNoteUID/change-status',
      EDIT: '/content/admin/release-note/:releaseNoteUID/edit'
    }
  }
};

export default apiConfig;
