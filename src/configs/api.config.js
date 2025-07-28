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
    AUDIT_LOGS: {
      VIEW: '/admin/audit-logs/list',
      DETAIL: '/admin/audit-logs/view/:Id'
    },
    USER_ENQUIRY: {
      LIST: '/admin/enquiry/list'
    },
    PAGE: {
      LIST: '/admin/pages/list',
      ADD: '/admin/pages/add',
      TOGGLE_STATUS: '/admin/pages/:pageID/change-status',
      DELETE: '/admin/pages/:pageID/delete',
      DETAIL: '/admin/pages/detail',
      UPDATE: '/admin/pages/update'
    },
    USER: {
      SET_EXCLUSION: '/admin/user/:userID/set-exclusion',
      DETAIL: '/admin//users/detail/:userUID',
      LIST: '/admin/users/list',
      REFERRAL_LIST: '/admin/users/referral/:userID',
      FUND: '/admin/users/fund',
      TRANSACTION_LIST: '/admin/users/transaction-list',
      TDS_SUMMARY_TRANSACTION_LIST: '/admin/users/tds-summary-transaction-list',
      TRANSACTION_DETAIL: '/admin/users/transaction-detail',
      CHANGE_STATUS: '/admin/users/change-status',
      REST_BANK_COUNT: '/admin/users/reset-bank-request-count',
      UPDATE_RISK_MANAGEMENT: '/admin/users/update-user-risk-management/:userID',
      ALL_TRANSACTION_LIST: '/admin/users/all-transaction-list',
      GET_COMMENT: '/admin/users/get-comment',
      UPDATE_COMMENT: '/admin/users/update-comment',
      LOGIN_HISTORY: '/admin/users/:userID/login-history',
      GET_COMMENT_DETAIL: '/admin/users/get-comment-detail',
      ADD_COMMENT: '/admin/users/add-comment',
      DELETE_COMMENT: '/admin/users/delete-comment',
      CHANE_PLAYER_FUND_PASSWORD: '/admin/user/change-manage-fund-password',
      SUMMARY: '/admin/users/summary',
      USER_SUMMARY: '/admin/user/summary',
      COUNTRY_LIST: '/admin/countries',
      SEGMENTATION_LIST: '/admin/segmentation/list'
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
      PROMOCODE_LIST: '/admin/v1/deposit-promocode/list',
      PROMOCODE_DETAIL: '/admin/v1/deposit-promocode/:promocodeId/details',
      PROMOCODE_CREATE: '/admin/v1/deposit-promocode/create',
      PROMOCODE_CHANGE_STATUS: '/admin/v1/deposit-promocode/:promocodeId/change-status',
      PROMOCODE_HISTORY: '/admin/v1/deposit-promocode/:promocodeId/history',
      PROMOCODE_SEGMENTATION: '/admin/v1/deposit-promocode/:promocodeId/segmentation',
      PROMOCODE_UPLOAD_SEGMENTATION: '/admin/v1/deposit-promocode/:promocodeId/segmentation',
      PROMOCODE_REMOVE_SEGMENTATION: '/admin/v1/deposit-promocode/:promocodeId/segmentation',
      PROMOCODE_DELETE: '/admin/v1/deposit-promocode/:promocodeId',
      SUMMARY: '/admin/v1/deposit-promocode/summary'
    },
    APP_SETTING: {
      APP_SETTING_LIST: '/admin/app-setting/list',
      APP_SETTING_DETAIL: `/admin/app-setting/:settingId/details`,
      APP_SETTING_EDIT: `/admin/app-setting/edit`,
      CLEAR_CACHE: `/admin/clear-cache`
    },
    BANNER: {
      BANNER_LIST: '/admin/banner/list',
      BANNER_CHANGE_STATUS: `/admin/banner/:bannerId/change-status`,
      BANNER_CREATE: '/admin/banner/create',
      BANNER_DELETE: `/admin/banner/:bannerId/delete`,
      BANNER_DETAIL: `/admin/banner/:bannerId/details`,
      BANNER_EDIT: `/admin//banner/:bannerId/edit`,
      BANNER_REORDER: '/admin/banner/reorder'
    },
    AFFILIATE: {
      AFFILIATE_LIST: '/admin/affiliates',
      CHANGE_STATUS: '/admin/affiliates/change-status',
      CREATE: '/admin/affiliates/create',
      AFFILIATE_DETAIL: '/admin/affiliates/:affiliateId/details',
      AFFILIATE_EDIT: '/admin/affiliates/edit',
      USER_JOINED_LIST: '/admin/affiliates/user-joined',
      TRANSACTION_LIST: '/admin/affiliates/transactions',
      PAYOUT_LIST: '/admin/affiliates/payout-histories',
      UPDATE_PAYOUT: '/admin/affiliates/update-payout',
      FUND: '/admin/affiliates/fund',
      AFFILIATE_LOGIN_HISTORY: '/admin/affiliates/:affiliateID/login-history',
      CHANGE_AFFILIATE_FUND_PASSWORD: '/admin/affiliate/change-manage-fund-password',
      SUMMARY: '/admin/affiliates/summary'
    },
    APP_VERSION: {
      LIST: '/admin/app-version/list',
      ADD: '/admin/app-version/create',
      UPDATE: '/admin/app-version/update',
      VIEW: '/admin/app-version/view/:appVersionId',
      EDIT: '/admin/app-version/edit/:appVersionId',
      ACTIVATE: '/admin/app-version/apply'
    },
    MERCHANDISE: {
      MERCHANDISE_LIST: '/admin/merchandises'
    },
    FANTASY_POINT: {
      FANTASY_FORMATS: '/admin/v1/fantasy-point/formats',
      SCORING_VERSION: '/admin/v1/fantasy-point/:format/version-list',
      FANTASY_POINT_DETAILS: '/admin/v1/fantasy-point/:version_id/details',
      GET_EDIT_FANTASY_POINT: '/admin/v1/fantasy-point/get-edit',
      EDIT_FANATSY_POINT: '/admin/v1/fantasy-point/edit'
    },
    TOURNAMENT: {
      LIST: '/admin/v1/tournament/tournament-list',
      GET_EDIT: '/admin/v1/tournament/:tournament_id/edit',
      EDIT: '/admin/v1/tournament/edit',
      CHANGE_STATUS: '/admin/v1/tournament/:tournament_id/change-status',
      GET_DEFAULT_CONTESTS: '/admin/v1/tournament/default-contests',
      SAVE_DEFAULT_CONTESTS: '/admin/v1/tournament/save-default-contests'
    },
    SETTINGS: {
      BANNED_STATE: {
        LIST: '/admin/bs/bs-list',
        ADD: '/admin/bs/add',
        DELETE: '/admin/bs/remove'
      },
      STATE_LIST: '/admin/bs/s-list',
      DEPOSIT_OFFER: {
        DEPOSIT_OFFER_LIST: '/admin/v1/deposit-offer/list',
        DEPOSIT_OFFER_DETAIL: '/admin/v1/deposit-offer/:depositOfferId/details',
        DEPOSIT_OFFER_CREATE: '/admin/v1/deposit-offer/create',
        DEPOSIT_OFFER_CHANGE_STATUS: '/admin/v1/deposit-offer/:depositOfferId/change-status',
        DEPOSIT_OFFER_HISTORY: '/admin/v1/deposit-offer/:depositOfferId/history',
        DEPOSIT_OFFER_SEGMENTATION: '/admin/v1/deposit-offer/:depositOfferId/segmentation',
        DEPOSIT_OFFER_UPLOAD_SEGMENTATION: '/admin/v1/deposit-offer/:depositOfferId/segmentation',
        DEPOSIT_OFFER_REMOVE_SEGMENTATION: '/admin/v1/deposit-offer/:depositOfferId/segmentation',
        DEPOSIT_OFFER_DELETE: '/admin/v1/deposit-offer/:depositOfferId'
      },
      MERCHANDISE: {
        MERCHANDISE_LIST: '/admin/v1/merchandise/list',
        MERCHANDISE_DETAIL: '/admin/v1/merchandise/:merchandiseId/details',
        MERCHANDISE_CREATE: '/admin/v1/merchandise/create',
        MERCHANDISE_EDIT: '/admin/v1/merchandise/:merchandiseId',
        MERCHANDISE_CHANGE_STATUS: '/admin/v1/merchandise/:merchandiseId/change-status',
        MERCHANDISE_WINNER_LIST: '/admin/v1/merchandise/winners',
        MERCHANDISE_WINNER_DETAIL: '/admin/v1/merchandise/winners/:merchandiseWinnerId',
        MERCHANDISE_WINNER_EDIT: '/admin/v1/merchandise/winners/:merchandiseWinnerId'
      },

      USER_KYC: {
        LIST: '/admin/kyc/doc/list',
        DETAILS: '/admin/kyc/doc/:documentId/details',
        UPDATE: '/admin/kyc/update'
      }
    },
    EMAIL_TEMPLATE: {
      LIST: '/admin/email-template/list',
      ADD: '/admin/email-template/add',
      DETAIL: '/admin/email-template/detail',
      UPDATE: '/admin/email-template/update',
      STATUS: '/admin/email-template/status'
    },
    REFERRAL_OFFER: {
      LIST: '/admin/v1/offers/list',
      UPDATE: '/admin/v1/offers/update'
    },
    COIN: {
      MERCHANDISE: {
        VIEW: '/admin/coin/merchandise-list',
        ADD: '/admin/coin/create-merchandise',
        EDIT: '',
        DETAIL: '/admin/coin/detail',
        DELETE: '/admin/coin/delete',
        SATAUS: '/admin/coin/status'
      },
      SWITCH_CONFIG: '/admin/coin/switch-configuration',
      CONFIGURATION: '/admin/coin/congfiguration',
      UPDATE_CONFIG: '/admin/coin/update-configuration'
    },
    GENERAL: {
      USERS_LIST: '/admin/users-data',
      PACKAGE: {
        LIST: '/admin/coin-package/list',
        CREATE: '/admin/coin-package/create-package',
        CHANGE_STATUS: '/admin/coin-package/change-status',
        PACKAGE_TRANSACTION: '/admin/coin-package/package-transaction',
        ARCHIVE_PACKAGE: '/admin/coin-package/:coinStoreId/package-archive'
      }
    },
    API_LOGS: '/admin/api-logs',
    SEGMENTATION: {
      LIST: '/admin/segmentation/list',
      ALL_LIST: '/admin/segmentation/allList',
      DETAIL: '/admin/segmentation/:segmentationUID/details',
      ADD_EDIT: '/admin/segmentation/add-edit',
      COUNTRY_LIST: '/admin/segmentation/countries',
      CHANGE_STATUS: '/admin/segmentation/:segmentationUID/change-status',
      USER_LIST: '/admin/segmentation/player-list',
      REFRESH_USER_LIST: '/admin/segmentation/:segmentationId/refresh'
    },
    COUNTRY: {
      LIST: '/config/admin/country/list',
      SUMMARY: '/config/admin/country/summary',
      CHANGE_STATUS: '/config/admin/country/:countryId/change-status'
    },
    PAYMENT: {
      DEPOSIT: '/payment/deposit',
      WINNING: '/payment/winning',
      WITHDRAW: '/payment/withdraw',
      BETSLIP: '/payment/betslip'
    },
    RISK_MANAGEMENT: {
      LIST: '/admin/risk-management/list',
      UPDATE: '/admin/update-risk-management'
    },
    CATEGORY: {
      LIST: '/admin/casino-management/category/list',
      SUMMARY: '/admin/casino-management/category/summary',
      CREATE: '/admin/casino-management/category/create',
      EDIT: '/admin/casino-management/category/:categoryId/edit',
      DELETE: '/admin/casino-management/category/:categoryId/delete',
      CHANGE_STATUS: '/admin/casino-management/category/:categoryId/change-status'
    },
    PROVIDER: {
      ALL_LIST: '/admin/casino-management/provider/all',
      LIST: '/admin/casino-management/provider/list',
      SUMMARY: '/admin/casino-management/provider/summary',
      CREATE: '/admin/casino-management/provider/create',
      EDIT: '/admin/casino-management/provider/:providerId/edit',
      DELETE: '/admin/casino-management/provider/:providerId/delete',
      CHANGE_STATUS: '/admin/casino-management/provider/:providerId/change-status',
      RESTRICTED_COUNTRY_LIST:
        '/admin/casino-management/provider/:providerId/restricted-country/list',
      COUNTRY_LIST: '/admin/casino-management/provider/:providerId/country/list',
      ADD_RESTRICTED_COUNTRY:
        '/admin/casino-management/provider/:providerId/restricted-country/add',
      REMOVE_RESTRICTED_COUNTRY:
        '/admin/casino-management/provider/:providerId/restricted-country/delete'
    },
    GAME: {
      LIST: '/admin/casino-management/games/list',
      SUMMARY: '/admin/casino-management/games/summary',
      DETAILS: '/admin/casino-management/games/:gameUID/details',
      CREATE: '/admin/casino-management/games/create',
      EDIT: '/admin/casino-management/games/:gameId/edit',
      DELETE: '/admin/casino-management/games/:gameId/delete',
      PROVIDER_LIST: '/admin/casino-management/games/providers',
      CATEGORY_LIST: '/admin/casino-management/category/list',
      GET_GAME_SEGMENTATION: '/admin/casino-management/games/:gameId/segmentation',
      ADD_GAME_SEGMENTATION: '/admin/casino-management/games/:gameId/segmentation'
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
      VIEW: '/admin/payment-provider/list',
      STATUS: '/admin/payment-provider/change-status'
    },
    GEORESTRICTION: {
      COUNTRY_LIST: '/admin/country/restrictions/list',
      BLOCKED_MODULES: '/admin/country/:countryId/restrictions/modules/list',
      BLOCKED_PROVIDERS: '/admin/country/:countryId/restrictions/providers/list',
      BLOCK_MODULE: '/admin/country/:countryId/restrict-country-module',
      BLOCK_PROVIDER: '/admin/country/:countryId/restrict-country-provider',
      BLOCK_COUNTRY: '/admin/country/restrictions',
      UNBLOCK_COUNTRY: '/admin/country/restrictions/:countryId/unrestrict'
    },
    USER_CLASS: {
      LIST: '/admin/user-classes/list',
      CREATE: '/admin/user-classes/create',
      DETAIL: '/admin/user-classes/:userClassUID/detail',
      UPDATE: '/admin/user-classes/update',
      CHANGE_STATUS: '/admin/user-classes/:userClassUID/change-status',
      DELETE: '/admin/user-classes/:userClassUID/delete'
    },
    USER_CLASS_LIMIT: {
      LIST: '/admin/user-class-limits/list',
      CREATE: '/admin/user-class-limits/create',
      DETAIL: '/admin/user-class-limits/:userClassLimitUID/detail',
      UPDATE: '/admin/user-class-limits/update',
      CHANGE_STATUS: '/admin/user-class-limits/:userClassLimitUID/change-status',
      DELETE: '/admin/user-class-limits/:userClassLimitUID/delete'
    },
    SEGMENTATION_LIMIT: {
      LIST: '/admin/segmentation-limits/list',
      CREATE: '/admin/segmentation-limits/create',
      DETAIL: '/admin/segmentation-limits/:segmentationLimitUID/detail',
      UPDATE: '/admin/segmentation-limits/update',
      CHANGE_STATUS: '/admin/segmentation-limits/:segmentationLimitUID/change-status',
      DELETE: '/admin/segmentation-limits/:segmentationLimitUID/delete'
    },
    RATE_LIMIT_RULES: {
      LIST: '/config/admin/rate-limit-rules/list',
      CHANGE_STATUS: '/config/admin/rate-limit-rules/:rateLimitUID/change-status'
    },
    BLACKLIST: {
      LIST: '/admin/blacklist/list',
      BLOCK: '/admin/blacklist/block',
      DELETE: '/admin/blacklist/:blacklistUID/delete'
    }
  }
};

export default apiConfig;
