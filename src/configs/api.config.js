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
      VALIDATE: '/admin/admin/auth/validate',
      VERIFYOTP: '/admin/admin/auth/login',
      RESENDOTP: '/admin/admin/auth/resend-otp',
      CHANGE_PASSWORD: '/admin/admin/auth/change-password',
      VALIDATE_RESET_PASSWORD: '/admin/admin/auth/validate-reset-password',
      RESET_PASSWORD: '/admin/admin/auth/reset-password',
      LOGOUT: '/admin/admin/auth/logout'
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
      TRANSACTION_LIST: '/wallet/admin/wallet/transaction-list',
      TDS_SUMMARY_TRANSACTION_LIST: '/users/admin/users/tds-summary-transaction-list',
      TRANSACTION_DETAIL: '/wallet/admin/wallet/transaction-detail',
      CHANGE_STATUS: '/users/admin/users/change-status',
      UPGRADE_USER_CLASS: '/users/admin/users/upgrade-user-class',
      REST_BANK_COUNT: '/users/admin/users/reset-bank-request-count',
      UPDATE_RISK_MANAGEMENT: '/users/admin/users/update-user-risk-management/:userID',
      ALL_TRANSACTION_LIST: '/users/admin/users/all-transaction-list',
      GET_COMMENT: '/users/admin/users/get-comment',
      UPDATE_COMMENT: '/users/admin/users/update-comment',
      LOGIN_HISTORY: '/users/admin/users/:userID/login-history',
      GET_COMMENT_DETAIL: '/users/admin/users/get-comment-detail',
      ADD_COMMENT: '/users/admin/users/add-comment',
      DELETE_COMMENT: '/users/admin/users/delete-comment',
      CHANE_PLAYER_FUND_PASSWORD: '/config/admin/config/user/change-manage-fund-password',
      SUMMARY: '/users/admin/users/summary',
      USER_SUMMARY: '/users/admin/users/summary',
      USER_OVER_ALL_SUMMARY: '/users/admin/user-summary/:userId',
      LIMIT_SUMMARY: '/users/admin/limit-summary/:userId',
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
      ADMIN_SUMMARY: '/admin/admin/admin/summary',
      COUNTRY_LIST: '/config/admin/config/countries'
    },
    EMAIL_PROVIDER: {
      VIEW: '/notifications/admin/email-provider/list',
      DELETE: '/notifications/admin/email-provider/:providerUID/delete',
      STATUS: '/notifications/admin/email-provider/:providerUID/change-status',
      EDIT: '/notifications/admin/email-provider/:providerUID/edit',
      DETAIL: '/notifications/admin/email-provider/:providerUID/details'
    },
    PAYMENT_PROVIDER_CONFIG: {
      VIEW: '/payments/admin/payment-provider/list',
      DELETE: '/payments/admin/payment-provider/:providerUID/delete',
      STATUS: '/payments/admin/payment-provider/:providerUID/change-status',
      EDIT: '/payments/admin/payment-provider/:providerUID/edit',
      DETAIL: '/payments/admin/payment-provider/:providerUID/details'
    },
    SMS_PROVIDER: {
      VIEW: '/notifications/admin/sms-provider/list',
      DELETE: '/notifications/admin/sms-provider/:providerUID/delete',
      STATUS: '/notifications/admin/sms-provider/:providerUID/change-status',
      EDIT: '/notifications/admin/sms-provider/:providerUID/edit',
      DETAIL: '/notifications/admin/sms-provider/:providerUID/details'
    },
    KYC_PROVIDER: {
      VIEW: '/users/admin/kyc-provider/list',
      DELETE: '/users/admin/kyc-provider/:providerUID/delete',
      STATUS: '/users/admin/kyc-provider/:providerUID/change-status',
      EDIT: '/users/admin/kyc-provider/:providerUID/edit',
      DETAIL: '/users/admin/kyc-provider/:providerUID/details'
    },
    LAYOUT_THEME: {
      VIEW: '/config/admin/layouts/list-theme',
      DELETE: '/layouts/theme-config/:themeConfigId/delete',
      EDIT: '/config/admin/layouts/list-theme/edit',
      DETAIL: '/config/admin/layouts/:layoutThemeID/detail',
      LAYOUT_LIST: '/config/admin/layouts/list',
      STATUS: '/config/admin/layouts/:layoutThemeID/status',
      CREATE: '/config/admin/layouts/create-theme'
    },
    SUPERVISOR: {
      DASHBOARD: '/admin/supervisor/dashboard',
      LIST: '/admin/supervisor/list',
      DETAIL: '/admin/supervisor/:supervisorId/details',
      AGENT_LIST: '/admin/supervisor/agents',
      CREATE_TARGET: '/admin/supervisor/commission-targets/:agentUID/create',
      UPDATE_TARGET: '/admin/supervisor/commission-targets/:agentUID/update',
      DELETE_TARGET: '/admin/supervisor/commission-targets/:agentUID/delete',
      GET_TARGET: '/admin/supervisor/commission-targets/:agentUID',
      LOGIN_HISTORY: '/admin/supervisor/:callingAgentUID/login-history',
      REDEEM_COMMISSION_REQUESTS: '/admin/supervisor/redeem-commission-requests',
      COMMISSION_REQUESTS_STATUS_UPDATE:
        '/admin/supervisor/redeem-commission-requests/:requestID/status'
    },
    BONUS_TEMPLATE: {
      LIST: '/bonus/admin/bonus-template/list',
      DETAIL: '/bonus/admin/bonus-template/:bonusTemplateID/details',
      CREATE: '/bonus/admin/bonus-template',
      UPDATE: '/bonus/admin/bonus-template/:bonusTemplateID',
      DELETE: '/bonus/admin/bonus-template/:bonusTemplateID',
      UPDATE_STATUS: '/bonus/admin/bonus-template/:bonusTemplateID/change-status',
      LIST_TAGS: '/bonus/admin/bonus-template/tags/list',
      DUPLICATE: '/bonus/admin/bonus-template/:bonusTemplateID/duplicate'
    },
    AGENT: {
      DASHBOARD: '/admin/agent/dashboard',
      LIST: '/admin/agent/list',
      CREATE: '/admin/agent/create',
      EDIT: '/admin/agent/edit',
      DETAIL: '/admin/agent/:callingAgentUID/details',
      PLAYER_LIST: '/admin/agent/:agentUID/players',
      CHANGE_STATUS: '/admin/agent/:agentId/change-status',
      ASSIGN_PLAYERS: '/admin/agent/assign-players',
      UNASSIGN_PLAYERS: '/admin/agent/unassign-players',
      UNASSIGNED_PLAYERS: '/admin/agent/unassigned-players',
      GET_SUMMARY: '/admin/agent/commission-summary',
      REDEEM_COMMISSION_REQUESTS: '/admin/agent/commission-redeem-request/:redeemSummaryID',
      GET_TOTAL_EVENTS: '/admin/agent/commission-events',
      GET_SUMMARY_DETAILS: '/admin/agent/commission-summary/:summaryId/details'
    },
    B2B_AGENT: {
      LIST: '/agent/admin/b2b-agent/list',
      CREATE: '/agent/admin/b2b-agent',
      EDIT: (agentUID) => `/agent/admin/b2b-agent/${agentUID}/edit`,
      CHANGE_STATUS: (agentUID) => `/agent/admin/b2b-agent/${agentUID}/status`,
      DETAIL: (agentUID) => `/agent/admin/b2b-agent/${agentUID}/details`,
      TREE: `/agent/admin/b2b-agent/hierarchy`,
      // child agent
      CHILD_AGENT_LIST: '/agent/child-agent/list',
      CHILD_AGENT_CREATE: '/agent/child-agent',
      CHILD_AGENT_EDIT: (agentUID) => `/agent/child-agent/${agentUID}/edit`,
      CHILD_AGENT_CHANGE_STATUS: (agentUID) => `/agent/child-agent/${agentUID}/status`,
      CHILD_AGENT_DETAIL: (agentUID) => `/agent/child-agent/${agentUID}/details`,
      AGENT_LOGIN_HISTORY: (agentUID) => `/agent/child-agent/${agentUID}/login-history`,
      CHILD_AGENT_DASHBOARD_COUNTS: '/agent/child-agent/dashboard/counts',
      CHANGE_AGENT_FUND_PASSWORD: '/config/admin/config/b2b-agent/change-manage-fund-password',
      // player
      PLAYER_LIST: '/users/agent/player/list',
      PLAYER_CREATE: '/users/agent/player',
      PLAYER_CHANGE_STATUS: (playerUID) => `/users/agent/player/${playerUID}/status`,
      PLAYER_DETAIL: (playerUID) => `/users/agent/player/${playerUID}/details`,
      PLAYER_DASHBOARD_COUNTS: '/users/agent/player-dashboard-counts',
      PLAYER_RESET_PASSWORD: (userUID) => `/users/agent/player/${userUID}/reset-password`,
      WALLET: {
        CREDIT_DEBIT_ADMIN_AGENT: (agentUID) => `/wallet/admin/agent/${agentUID}/credit-debit`,
        CREDIT_DEBIT_AGENT: (agentUID) => `/wallet/agent/${agentUID}/credit-debit`,
        CREDIT_AGENT_PLAYER: (agentUID, userUID) =>
          `/wallet/agent/${agentUID}/player/${userUID}/credit`,
        AGENT_TRANSACTION_LIST: (agentUID) => `/wallet/agent/${agentUID}/transaction/list`,
        WITHDRAW_REQUEST_LIST: `/wallet/agent-player/withdraw-requests`,
        CREATE_WITHDRAW_REQUEST: `/wallet/agent/wallet/withdraw-request`,
        GET_AGENT_WALLET: (agentUID) => `/wallet/agent/${agentUID}/wallet`,
        WITHDRAW_REQUEST_UPDATE_STATUS: (withdrawRequestID) =>
          `/wallet/${withdrawRequestID}/handle-withdraw-request`,
        AGENT_MANUAL_ADJUSTMENT: `wallet/admin/agent/wallet/manual-adjustment`,
        OPERATOR_WALLET: `/wallet/operator/wallet`,
        OPERATOR_TRANSACTION_LIST: `/wallet/operator/transaction-list`,
        OPERATOR_WALLET_UPDATE: `/wallet/operator/wallet/credit-debit`,
        AGENT_COMMISSION_REPORT: `/wallet/admin/agent-commission-report`,
        AGENT_WALLET_REPORT: `/wallet/admin/agent-wallet-report`
      }
    },
    TENANT: {
      LIST: '/config/admin/tenant/list',
      CHANGE_STATUS: '/config/admin/tenant/:tenantUID/change-status',
      CREATE: '/config/admin/tenant/create'
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
    BONUS_CAMPAIGN: {
      LIST: '/bonus/admin/v1/bonus-campaign/list',
      DETAIL: '/bonus/admin/v1/bonus-campaign/:id/details',
      CREATE: '/bonus/admin/v1/bonus-campaign/create',
      UPDATE: '/bonus/admin/v1/bonus-campaign/:id',
      CHANGE_STATUS: '/bonus/admin/v1/bonus-campaign/:id/change-status',
      GRANT_LIST: '/bonus/admin/v1/bonus-campaign/:id/grants',
      WAGERING_CONTRIBUTIONS: '/bonus/admin/v1/bonus-campaign/grant/:grantId/wagering',
      SUMMARY: '/bonus/admin/v1/bonus-campaign/summary',
      PROCESS_BONUS_TRANSFER: '/bonus/admin/v1/bonus-campaign/grant/:bonusGrantID/manage'
    },
    BANNER: {
      BANNER_LIST: '/content/admin/banner/list',
      BANNER_CHANGE_STATUS: `/content/admin/banner/:bannerId/change-status`,
      BANNER_CREATE: '/content/admin/banner/create',
      BANNER_DELETE: `/content/admin/banner/:bannerId/delete`,
      BANNER_DETAIL: `/content/admin/banner/:bannerId/details`,
      BANNER_EDIT: `/content/admin/banner/:bannerId/edit`,
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
      CHANGE_AFFILIATE_FUND_PASSWORD: '/config/admin/config/affiliate/change-manage-fund-password',
      SUMMARY: '/affiliates/admin/affiliates/summary'
    },
    SETTINGS: {
      USER_KYC: {
        LIST: '/users/admin/kyc/doc/list',
        DETAILS: '/users/admin/kyc/doc/:documentId/details',
        UPDATE: '/users/admin/kyc/update'
      },
      KYC_CONFIGURATIONS: {
        GET_CONFIGURATIONS: '/users/admin/kyc/get-level-config',
        UPDATE_CONFIGURATIONS: '/users/admin/kyc/set-level-config'
      }
    },
    EVENT_TEMPLATE: {
      LIST: '/notifications/admin/event-templates/list',
      TEMPLATE_MASTER_DATA: '/notifications/admin/event-templates/get-template-master-data',
      ADD: '/notifications/admin/event-templates/add',
      DETAIL: '/notifications/admin/event-templates/detail',
      UPDATE: '/notifications/admin/event-templates/update',
      STATUS: '/notifications/admin/event-templates/status',
      ASSIGN_EVENT_TEMPLATE: '/notifications/admin/event-templates/update-event-template',
      TEMPLATE_LIST: '/notifications/admin/event-templates/event-channel-templates-list'
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
      CHANGE_STATUS: '/bonus/admin/segmentation/:segmentationUID/change-status',
      USER_LIST: '/bonus/admin/segmentation/player-list',
      REFRESH_USER_LIST: '/bonus/admin/segmentation/:segmentationId/refresh'
    },
    PLAYER_SEGMENTATION: {
      LIST: '/bonus/admin/player-segmentation/list',
      ADD: '/bonus/admin/player-segmentation/add',
      EDIT: '/bonus/admin/player-segmentation/edit',
      DETAIL: '/bonus/admin/player-segmentation/:segmentationUID/details',
      CHANGE_STATUS: '/bonus/admin/player-segmentation/:segmentationUID/change-status',
      REFRESH: '/bonus/admin/player-segmentation/:segmentationUID/refresh',
      PLAYER_LIST: '/bonus/admin/player-segmentation/:segmentationUID/player-list',
      PLAYER_LIST_EXPORT: '/bonus/admin/player-segmentation/:segmentationUID/player-list/export',
      PLAYER_PREVIEW: '/bonus/admin/player-segmentation/preview',
      CHANGE_LOG: '/bonus/admin/player-segmentation/:segmentationUID/change-log',
      EXECUTION_LOG: '/bonus/admin/player-segmentation/execution-log',
      MAP_CHANGE_LOG: '/bonus/admin/player-segmentation/:segmentationUID/map-change-log',
      ARCHIVE: '/bonus/admin/player-segmentation/:segmentationUID/archive'
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
      UPDATE: '/config/admin/risk-management/update-risk-management',
      HISTORY: '/config/admin/risk-management/history'
    },
    CATEGORY: {
      LIST: '/games/admin/casino-management/category/list',
      SUMMARY: '/games/admin/casino-management/category/summary',
      CREATE: '/games/admin/casino-management/category/create',
      EDIT: '/games/admin/casino-management/category/:categoryId/edit',
      DELETE: '/games/admin/casino-management/category/:categoryId/delete',
      CHANGE_STATUS: '/games/admin/casino-management/category/:categoryId/change-status',
      ALL_ACTIVE_LIST: '/games/admin/casino-management/category/all'
    },
    TOOLS: {
      DETAIL: '/games/admin/ip-lookup/details'
    },
    PROVIDER: {
      ALL_LIST: '/games/admin/casino-management/provider/all',
      LIST: '/games/admin/casino-management/provider/list',
      SUMMARY: '/games/admin/casino-management/provider/summary',
      CREATE: '/games/admin/casino-management/provider/create',
      EDIT: '/games/admin/casino-management/provider/:providerId/edit',
      DELETE: '/games/admin/casino-management/provider/:providerId/delete',
      CHANGE_STATUS: '/games/admin/casino-management/provider/:providerId/change-status',
      REORDER: '/games/admin/casino-management/provider/reorder',
      RESTRICTED_COUNTRY_LIST:
        '/games/admin/casino-management/provider/:providerId/restricted-country/list',
      COUNTRY_LIST: '/games/admin/casino-management/provider/:providerId/country/list',
      ADD_RESTRICTED_COUNTRY:
        '/games/admin/casino-management/provider/:providerId/restricted-country/add',
      REMOVE_RESTRICTED_COUNTRY:
        '/games/admin/casino-management/provider/:providerId/restricted-country/delete'
    },
    AGGREGATOR: {
      LIST: '/games/admin/casino-management/aggregators/all',
      FETCH_QT_GAMES: '/games/qt/feed-games',
      FETCH_SOFTSWISS_GAMES: '/games/softswiss/feed-games'
    },
    CURRENCY: {
      DEFAULT: '/wallet/admin/default-currency',
      LIST: '/wallet/admin/currency/list',
      CODES: '/wallet/admin/currency/codes/list',
      SUMMARY: '/games/admin/casino-management/currency/summary',
      CREATE: '/wallet/admin/currency/create',
      GET_BY_ID: '/wallet/admin/currency/:currencyId',
      UPDATE: '/wallet/admin/currency/:currencyId',
      DELETE: '/wallet/admin/currency/:currencyId',
      CHANGE_STATUS: '/wallet/admin/currency/status/:currencyId',
      ADMIN_EXCHANGE_RATE: '/wallet/admin/currency/add-exchange-rate/:currencyId',
      ADMIN_EXCHANGE_TYPE_UPDATE: '/wallet/admin/currency/exchange-update-type/:currencyId',
      PLATFORM_CODE_LIST: '/wallet/admin/currency/platforms/codes'
    },
    EXCHANGE_RATE: {
      HISTORY: '/wallet/admin/exchange-rate/history/:currencyId',
      CREATE: '/wallet/admin/exchange-rate/create',
      UPDATE: '/wallet/admin/exchange-rate/:exchangeRateId',
      DELETE: '/wallet/admin/exchange-rate/:exchangeRateId',
      CHANGE_STATUS: '/wallet/admin/exchange-rate/status/:exchangeRateId'
    },
    GAME: {
      LIST: '/games/admin/casino-management/games/list',
      SUMMARY: '/games/admin/casino-management/games/summary',
      DETAILS: '/games/admin/casino-management/games/:gameUID/details',
      CREATE: '/games/admin/casino-management/games/create',
      EDIT: '/games/admin/casino-management/games/:gameId/edit',
      DELETE: '/games/admin/casino-management/games/:gameId/delete',
      CHANGE_STATUS: '/games/admin/casino-management/games/:gameId/change-status',
      PROVIDER_LIST: '/games/admin/casino-management/games/providers',
      CATEGORY_LIST: '/games/admin/casino-management/category/list',
      GET_GAME_SEGMENTATION: '/games/admin/casino-management/games/:gameId/segmentation',
      ADD_GAME_SEGMENTATION: '/games/admin/casino-management/games/:gameId/segmentation'
    },
    REPORTS: {
      BETSLIP: '/bets/admin/report/betslip',
      BETSLIP_EXPORT: '/bets/admin/report/betslip/export',
      DEPOSIT_TRANSACTIONS: '/wallet/admin/report/deposit',
      WITHDRAW_TRANSACTIONS: '/wallet/admin/report/withdraw',
      DEPOSIT_TRANSACTIONS_EXPORT: '/wallet/admin/report/deposit/export',
      WITHDRAW_TRANSACTIONS_EXPORT: '/wallet/admin/report/withdraw/export',

      PLAYER_BALANCE_LIST: '/admin/reports/player-balance/list',
      PLAYER_BALANCE_EXPORT: '/admin/reports/player-balance/export',
      DEPOSIT_BONUS_LIST: '/admin/reports/deposit-bonus/list',
      DEPOSIT_BONUS_EXPORT: '/admin/reports/deposit-bonus/export'
    },
    CRM: {
      SEND: '/notifications/admin/crm/sendNotification',
      LIST: '/notifications/admin/crm/notification/list',
      DETAIL: '/notifications/admin/crm/notification/:notificationId/details'
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
      STATUS: '/payments/admin/payment-provider/:gatewayId/change-status'
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
      CHANGE_STATUS: '/config/admin/rate-limit-rules/:rateLimitUID/change-status',
      DETAIL: '/config/admin/rate-limit-rules/:rateLimitUID/detail',
      UPDATE: '/config/admin/rate-limit-rules/:rateLimitUID/update'
    },
    BLACKLIST: {
      LIST: '/users/admin/blacklist/list',
      BLOCK: '/users/admin/blacklist/block',
      DELETE: '/users/admin/blacklist/:blacklistUID/delete',
      DISPOSABLE_EMAIL: {
        LIST: '/users/admin/blacklist/email-domain/list',
        CREATE: '/users/admin/blacklist/email-domain',
        DELETE: '/users/admin/blacklist/email-domain/:restrictedDomainID'
      }
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
      DETAIL: '/payments/admin/deposit-bank/:depositId/manual-deposit/details',
      EDIT: '/payments/admin/user-bank-deposit/:depositId/edit',
      DELETE: '/payments/admin/user-bank-deposit/:depositId/delete'
    },
    RELEASE_NOTES: {
      LIST: '/content/admin/release-note/list',
      CREATE: '/content/admin/release-note/create',
      DELETE: '/content/admin/release-note/:releaseNoteUID/delete',
      DETAIL: '/content/admin/release-note/:releaseNoteUID/details',
      CHANGE_STATUS: '/content/admin/release-note/:releaseNoteUID/change-status',
      EDIT: '/content/admin/release-note/:releaseNoteUID/edit'
    },
    APP_SETTINGS: {
      UPDATE: '/config/admin/config/app-setting/update'
    },
    WALLET: {
      LIST: '/wallet/admin/wallet/list/:userUID',
      ALL_WALLET_LIST: '/wallet/admin/wallet/all-wallet-list/:userUID',
      FUND: '/wallet/admin/wallet/fund'
    },
    RESPONSIBLE_GAMING_LIMITS: {
      USER_ALL_LIMITS: '/users/admin/responsible-gaming-limits/users/:userId/all-limits',
      USER_BULK_UPDATE: '/users/admin/responsible-gaming-limits/users/:userId/bulk-update',
      HISTORY: '/users/admin/responsible-gaming-limits/history'
    },
    USER_CLASS_LIMITS: {
      HISTORY: '/users/admin/user-class-limits/history'
    },
    RESPONSIBLE_GAMBLING_RESTRICTIONS: {
      LIST: '/users/admin/responsible-gaming-restrictions/self-exclusion/list',
      DETAIL: '/users/admin/responsible-gaming-restrictions/:restrictionId/detail',
      CREATE: '/users/admin/responsible-gaming-restrictions/create',
      EDIT: '/users/admin/responsible-gaming-restrictions/:restrictionId/update',
      DELETE: '/users/admin/responsible-gaming-restrictions/:restrictionId/delete',
      CHANGE_STATUS: '/users/admin/responsible-gaming-restrictions/:restrictionId/change-status',
      APPROVE: '/users/admin/responsible-gaming-restrictions/:restrictionId/approve'
    },
    AFFILIATES: {
      AFFILIATE_LIST: '/affiliates/admin/affiliates/list',
      REFERRAL_LIST: '/affiliates/admin/affiliates/{affiliateId}/referred-users',
      TRANSACTION_LIST:
        '/affiliates/admin/affiliates/{affiliateId}/referred-users-commission-transaction',
      WITHDRAWAL_LIST: '/affiliates/admin/commission/withdraw/list',
      WITHDRAWAL_APPROVE: '/affiliates/admin/commission/withdraw/approve',
      WITHDRAWAL_REJECT: '/affiliates/admin/commission/withdraw/reject',
      AFFILIATE_DETAIL: '/affiliates/admin/affiliates/{affiliateId}/details',
      CAMPAIGNS_LIST: '/affiliates/admin/affiliates/{affiliateId}/campaign-list',
      CAMPAIGN_CHANGE_STATUS: '/affiliates/admin/affiliates/campaign/{campaignUID}/changes-status',
      CAMPAIGN_DETAILS: '/affiliates/admin/affiliates/campaign/{campaignUID}/details',
      COMMISSION_SUMMARY: '/affiliates/admin/affiliates/{affiliateId}/commission-summary',
      COMMISSION_SETTINGS: '/affiliates/admin/affiliates/{affiliateId}/commission-settings',
      COMMISSION_SETTINGS_UPDATE: '/affiliates/admin/affiliates/commission-setting/update',
      GLOBAL_COMMISSION_SETTINGS: '/affiliates/admin/affiliates/global/commission-setting',
      AFFILIATE_TRANSACTIONS: '/affiliates/admin/affiliates/{affiliateId}/transactions',
      CAMPAIGN_REPORT: '/affiliates/admin/affiliates/campaign-report',
      COMMISSION_SUMMARY_REPORT:
        '/affiliates/admin/affiliates/{affiliateId}/export-commission-summary',
      REFERRED_USERS_REPORT: '/affiliates/admin/affiliates/{affiliateId}/export-referred-users',
      CREATE: '/users/admin/users/create-affiliate-user',
      EDIT: '/users/admin/users/edit-affiliate-user',
      CHANGE_STATUS: '/affiliates/admin/affiliates/{affiliateUID}/change-status',
      DROPDOWN: '/affiliates/admin/affiliates/normal-list'
    },
    FAQ: {
      LIST: '/affiliates/admin/faq/list',
      CREATE: '/affiliates/admin/faq/create',
      UPDATE: '/affiliates/admin/faq/update',
      DELETE: '/affiliates/admin/faq/delete/{faqUID}'
    },
    USER_WITHDRAW: {
      LIST: '/wallet/admin/payment/withdraw-request/list',
      MANUAL_VERIFY: '/wallet/admin/payment/withdraw-request/update-status',
      DETAIL: '/wallet/admin/payment/withdraw-request/:withdrawId/manual-withdraw/details',
      EDIT: '/wallet/admin/payment/withdraw-request/:withdrawId/edit',
      DELETE: '/wallet/admin/payment/withdraw-request/:withdrawId/delete'
    },
    BLOG_CATEGORY: {
      LIST: '/content/admin/blog-category/list',
      CREATE: '/content/admin/blog-category/create',
      EDIT: '/content/admin/blog-category/:categoryId/edit',
      DELETE: '/content/admin/blog-category/:categoryId/delete',
      DETAIL: '/content/admin/blog-category/:categoryId/details',
      CHANGE_STATUS: '/content/admin/blog-category/:categoryId/change-status'
    },
    BLOG: {
      LIST: '/content/admin/blogs/list',
      CREATE: '/content/admin/blogs/create',
      EDIT: '/content/admin/blogs/:blogId/edit',
      DELETE: '/content/admin/blogs/:blogId/delete',
      DETAIL: '/content/admin/blogs/:slug/details',
      CHANGE_STATUS: '/content/admin/blogs/:blogId/change-status'
    },
    ENQUIRES: {
      LIST: '/users/admin/enquiries/list',
      CHANGE_STATUS: '/users/admin/enquiries/update-status'
    }
  }
};

export default apiConfig;
