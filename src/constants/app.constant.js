export const APP_NAME = 'Bet Nexus';
//
export const APP_KEY = 'tailux';

// Redirect Paths
export const REDIRECT_URL_KEY = 'redirect';
export const HOME_PATH = '/';
export const GHOST_ENTRY_PATH = '/login';

// Navigation Types
export const NAV_TYPE_ROOT = 'root';
export const NAV_TYPE_GROUP = 'group';
export const NAV_TYPE_COLLAPSE = 'collapse';
export const NAV_TYPE_ITEM = 'item';
export const NAV_TYPE_DIVIDER = 'divider';

export const COLORS = ['neutral', 'primary', 'secondary', 'info', 'success', 'warning', 'error'];

export const USER_CLASS_LIMIT_TYPE = {
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdrawal',
  WAGER: 'Wager',
  LOSS: 'Loss'
};
export const USER_CLASS_LIMIT_PERIOD = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly'
};

export const PLATFORM_TYPE = {
  B2B: 'b2b', // Business to Business
  B2C: 'b2c' // Business to Customer
};

export const LOCAL_STORAGE = {
  USER_DATA: 'UserData',
  AUTH_TOKEN: 'AuthToken',
  SETTINGS: 'Settings',
  ACTIVE_SPORT_ID: 'ActiveSportId',
  PERMISSIONS: 'Permissions',
  IS_MASTER_ADMIN: 'IsMasterAdmin',
  AUTH_PASSWORD: 'authPassword',
  TWO_STEP_MODE: 'twoStepMode',
  AUTH_EMAIL: 'authEmail',
  LANGUAGE: 'language',
  IS_AGENT_USER: 'IsAgentUser'
};

export const HOME_CATEGORY_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
};
export const HOME_GAME_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
};

export const PAYOUT_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2
};
export const AGENT_TRANSACTION_TYPE = {
  ALLOCATION: 19,
  DEALLOCATION: 20,
  COMMISSION_CREDIT: 21,
  COMMISSION_DEBIT: 22,
  MANUAL_ADJUSTMENT: 23
};

export const TRANSACTION = {
  TRANSACTION_TYPE: {
    SYSTEM: 0,
    DEPOSIT: 1,
    WITHDRAW: 2,
    WINNING: 3,
    BETSLIP: 4,
    WITHDRAW_TAX: 5,
    DEPOSIT_TAX: 6,
    DEPOSIT_PROMO_CODE_BENEFIT: 7,
    AFFILIATE_COMMISION_ON_USER_SIGNUP: 8,
    REFERRAL_SIGNUP_BONUS: 9,
    AFFILIATE_COMMISION_ON_USER_DEPOSIT: 10,
    AFFILIATE_COMMISION_ON_USER_LOSS: 11,
    AFFILIATE_PAYOUT: 12,
    WITHOUT_REFERRAL_SIGNUP_BONUS: 13,
    REFERRAL_PAN_VERIFICATION: 14,
    REFERRAL_BANK_VERIFICATION: 15,
    WITHOUT_REFERRAL_PAN_VERIFICATION: 16,
    WITHOUT_REFERRAL_BANK_VERIFICATION: 17,
    ROLLBACK: 18,
    // agent transaction type
    ...AGENT_TRANSACTION_TYPE
  }
};

export const PAYMENT_OPT = {
  DEPOSIT: 1,
  WITHDRAW: 2,
  WINNING: 3,
  BETSLIP: 4
};

export const DOCUMENT_TYPE = {
  DOCUMENT: 1,
  BANK: 2
};

export const DOCUMENT_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2
};

export const PERMISSIONS = {
  ROLES: {
    VIEW: 'roles-view',
    ADD: 'roles-add',
    EDIT: 'roles-edit',
    DELETE: 'roles-delete'
  },
  USER: {
    LIST: 'user-view',
    REFERRAL_LIST: 'user-referral',
    TRANSACTION_LIST: 'user-transaction',
    USER_GAMES: 'user-games',
    ADD_MONEY: 'user-add-money',
    CHANGE_STATUS: 'user-change-status',
    TRANSACTION: 'user-transaction',
    GAMES: 'user-games',
    EXPORT_USER: 'users-export',
    RESET_BANK_REQUEST_COUNT: 'user-reset-bank-request-count',
    COMMENT_VIEW: 'user-comment-view',
    COMMENT_ADD: 'user-comment-add',
    COMMENT_EDIT: 'user-comment-edit',
    COMMENT_DELETE: 'user-comment-delete',
    ALL_TRANSACTION: 'all-transaction',
    USER_LEVEL_LIMITS: 'user-level-risk-mangement',
    VIEW_LOGIN_HISTORY: 'user-login-history-view'
  },
  SUPERVISOR: {
    LIST: 'supervisor-view'
  },
  CALLING_AGENT: {
    LIST: 'calling-agent-view',
    Add: 'calling-agent-add',
    DELETE: 'calling-agent-delete',
    EDIT: 'calling-agent-edit'
  },
  REPORT: {
    BETSLIP_REPORT_VIEW: 'betslip-report-view',
    DEPOSIT_REPORT_VIEW: 'deposit-report-view',
    WITHDRAW_REPORT_VIEW: 'withdraw-report-view',
    BETSLIP_EXPORT_REPORT: 'betslip-export-report',
    DEPOSIT_EXPORT_REPORT: 'deposit-export-report',
    WITHDRAW_EXPORT_REPORT: 'withdraw-export-report',
    PLAYER_BALANCE_REPORT_VIEW: 'player-balance-report-view',
    PLAYER_BALANCE_EXPORT_REPORT: 'player-balance-export-report',
    AGENT_COMMISSION_REPORT: 'agent-commission-report',
    AGENT_WALLET_REPORT: 'agent-wallet-report'
  },
  USER_LIMIT_SETTING: {
    VIEW: 'limit-setting-view',
    UPDATE: 'limit-setting-update'
  },
  COUNTRIES: {
    LIST: 'country-view',
    CHANGE_STATUS: 'country-change-status'
  },
  AUDIT_LOG: {
    VIEW: 'user-enquiry-view'
  },
  USER_ENQUIRY: {
    LIST: 'user-enquiry-view'
  },
  PAGE: {
    LIST: 'pages-view',
    EDIT: 'pages-edit',
    STATUS: 'pages-change-status'
  },
  APP_VERSION: {
    VIEW: 'app-version-view',
    ADD: 'app-version-add',
    EDIT: 'app-version-edit',
    STATUS: 'app-version-change-status',
    APPLY: 'app-version-apply'
  },
  ADMIN: {
    LIST: 'admin-view',
    CREATE: 'admin-add',
    EDIT: 'admin-edit',
    CHANGE_STATUS: 'admin-change-status',
    VIEW_LOGIN_HISTORY: 'admin-login-history-view'
  },
  BANNER: {
    LIST: 'banner-view',
    ADD: 'banner-add',
    EDIT: 'banner-edit',
    VIEW: 'banner-view',
    DELETE: 'banner-delete',
    CHANGE_STATUS: 'banner-change-status',
    UPLOAD_SEGMENTATION_CSV: 'banner-upload-segmentation-csv',
    SEGMENTATION: 'banner-upload-segmentation-csv'
  },
  BLOG: {
    LIST: 'blogs-view',
    CREATE: 'blogs-create',
    EDIT: 'blogs-edit',
    DELETE: 'blogs-delete',
    CHANGE_STATUS: 'blogs-change-status'
  },
  BLOG_CATEGORY: {
    LIST: 'blog-categories-view',
    CREATE: 'blog-categories-create',
    EDIT: 'blog-categories-edit',
    DELETE: 'blog-categories-delete',
    CHANGE_STATUS: 'blog-categories-change-status'
  },
  APP_SETTING: {
    LIST: 'app-setting-view'
  },
  DEPOSIT_PROMOCODE: {
    LIST: 'deposit-promo-code-view',
    ADD: 'deposit-promo-code-add',
    USER_LIST: 'deposit-promo-code-users-list',
    CHANGE_STATUS: 'deposit-promo-code-change-status',
    DELETE: 'deposit-promo-code-delete',
    SEGMENTATION: 'deposit-promo-code-segmentation'
  },
  BONUS_CAMPAIGN: {
    LIST: 'bonus-campaign-view',
    ADD: 'bonus-campaign-add',
    USER_LIST: 'bonus-campaign-users-list',
    CHANGE_STATUS: 'bonus-campaign-change-status',
    DELETE: 'bonus-campaign-delete',
    SEGMENTATION: 'bonus-campaign-segmentation'
  },
  EMAIL_TEMPLATE: {
    LIST: 'setting-email-template-view',
    ADD: 'setting-email-template-add',
    EDIT: 'setting-email-template-edit'
  },
  EVENT_TEMPLATE: {
    VIEW: 'event-template-view',
    ADD: 'event-template-add',
    EDIT: 'event-template-edit',
    CHANGE_STATUS: 'event-template-status',
    DELETE: 'event-template-delete',
    ASSIGN: 'event-template-assign'
  },
  REFERRAL_OFFERS: {
    VIEW: 'setting-referral-amount-view'
  },
  API_LOGS: 'api-logs-view',
  SEGMENTATION: {
    LIST: 'segmentation-view',
    ADD: 'segmentation-add',
    EDIT: 'segmentation-add',
    CHANGE_STATUS: 'segmentation-change-status',
    PLAYER_LIST: 'segmentation-player-list'
  },
  AFFILIATES: {
    LIST: 'affiliate-view',
    CHANGE_STATUS: 'affiliate-change-status',
    ADD: 'affiliate-add',
    EDIT: 'affiliate-edit',
    ADD_MONEY: 'affiliate-add-money',
    TRANSACTIONS: 'affiliate-transactions',
    USER_SIGNUP_LIST: 'affiliate-user-signup-list',
    PAYOUT: 'affiliate-payout',
    UPDATE_PAYTOUT: 'affiliate-payout-update',
    VIEW_LOGIN_HISTORY: 'affiliate-login-history-view',
    WITHDRAWALS_LIST: 'affiliate-withdrawals-list',
    COMMISSION: 'affiliate-commission',
    CAMPAIGNS: 'affiliate-campaigns',
    TRANSACTIONS_LIST: 'affiliate-transactions-list',
    CREATE: 'affiliate-create'
  },
  PAYMENT: {
    VIEW: 'payment-view'
  },
  USER_KYC: {
    VIEW: 'user-kyc-view'
  },
  CATEGORY: {
    VIEW: 'category-view',
    CREATE: 'category-create',
    EDIT: 'category-edit',
    CHANGE_STATUS: 'category-change-status',
    DELETE: 'category-delete'
  },
  PROVIDER: {
    VIEW: 'provider-view',
    CREATE: 'provider-create',
    EDIT: 'provider-edit',
    ADD_RESTRICTED_COUNTRY: 'provider-add-restricted-country',
    REMOVE_RESTRICTED_COUNTRY: 'provider-remove-restricted-country',
    CHANGE_STATUS: 'provider-change-status',
    VIEW_RESTRICTED_COUNTRY: 'provider-view-restricted-country',
    GAMES: 'provider-games'
  },
  AGGREGATOR: {
    VIEW: 'aggregators-view',
    FEED_GAMES: 'aggregator-feed-games'
  },
  GAME: {
    VIEW: 'game-view',
    CREATE: 'game-create',
    EDIT: 'game-edit',
    CHANGE_STATUS: 'game-chnage-status',
    DELETE: 'game-delete',
    ADD_SEGMENTATION: 'game-add-segmentation'
  },
  CRM: {
    VIEW: 'crm-view'
  },
  EMAIL_PROVIDER: {
    LIST: 'email-provider-view',
    DELETE: 'email-provider-delete',
    CHANGE_STATUS: 'email-provider-status',
    EDIT: 'email-provider-edit'
  },
  KYC_PROVIDER: {
    LIST: 'kyc-provider-view',
    DELETE: 'kyc-provider-delete',
    CHANGE_STATUS: 'kyc-provider-status',
    EDIT: 'kyc-provider-edit'
  },
  SMS_PROVIDER: {
    LIST: 'sms-provider-view',
    DELETE: 'sms-provider-delete',
    CHANGE_STATUS: 'sms-provider-status',
    EDIT: 'sms-provider-edit'
  },
  PAYMENT_PROVIDER: {
    LIST: 'payment-provider-view',
    DELETE: 'payment-provider-delete',
    CHANGE_STATUS: 'payment-provider-status',
    EDIT: 'payment-provider-edit'
  },
  FRONTEND: {
    VIEW: 'frontend-home-category-list',
    ADD_HOME_CATEGORY: 'frontend-home-add-category',
    EDIT_HOME_CATEGORY: 'frontend-home-edit-category',
    CHANGE_HOME_CATEGORY_STATUS: 'frontend-change-home-category-status',
    REORDER_HOME_CATEGORY: 'frontend-reorder-home-category',
    VIEW_HOME_GAMES: 'frontend-home-game-list',
    ADD_HOME_GAMES: 'frontend-add-home-games',
    CHANGE_HOME_GAME_STATUS: 'frontend-change-home-game-status',
    REORDER_HOME_GAMES: 'frontend-reorder-home-games',
    DELETE_HOME_GAME: 'frontend-delete-home-game',
    APPEARANCE_VIEW: 'frontend-view-appearance',
    ADD_APPEARANCE: 'frontend-add-appearance',
    CHANGE_APPEARANCE_STATUS: 'frontend-change-appearance-status',
    LAYOUT_THEME: {
      VIEW: 'layout-theme-view',
      ADD: 'layout-theme-add',
      EDIT: 'layout-theme-edit',
      STATUS: 'layout-theme-status'
    }
  },
  BUX_AI: {
    VIEW: 'bux-ai-view'
  },
  TENANT: {
    VIEW: 'tenant-view',
    CREATE: 'tenant-create',
    CHANGE_STATUS: 'tenant-change-status'
  },
  REFERRAL_MANAGEMENT: {
    VIEW: 'referral-management-view'
  },
  USER_CLASS: {
    LIST: 'player-class-list',
    VIEW: 'player-class-view',
    CREATE: 'player-class-create',
    EDIT: 'player-class-edit',
    CHANGE_STATUS: 'player-class-change-status',
    DELETE: 'player-class-delete',
    ASSIGN_BANK: 'player-class-assign-bank'
  },
  USER_CLASS_LIMIT: {
    LIST: 'player-class-limit-list',
    CREATE: 'player-class-limit-create',
    EDIT: 'player-class-limit-edit',
    CHANGE_STATUS: 'player-class-limit-change-status',
    DELETE: 'player-class-limit-delete'
  },
  RATE_LIMIT_RULES: {
    LIST: 'rate-limit-rules-view'
  },
  RESPONSIBLE_GAMBLING: {
    LIST: 'responsible-gambling-list',
    CREATE: 'responsible-gambling-create',
    EDIT: 'responsible-gambling-edit',
    CHANGE_STATUS: 'responsible-gambling-change-status',
    DELETE: 'responsible-gambling-delete'
  },
  BANK: {
    VIEW: 'bank-view',
    STATUS: 'bank-status',
    CREATE: 'bank-create',
    EDIT: 'bank-edit'
  },
  USER_MANUAL_DEPOSIT_TRANSACTION: {
    VIEW: 'user-manual-deposit-transaction-view',
    ADD: 'user-manual-deposit-transaction-add',
    EDIT: 'user-manual-deposit-transaction-edit'
  },
  CURRENCIES: {
    LIST: 'currencies-list',
    CREATE: 'currencies-create',
    EDIT: 'currencies-edit',
    CHANGE_STATUS: 'currencies-change-status',
    DELETE: 'currencies-delete',
    EXCHANGE_HISTORY: 'currencies-exchange-history',
    ADMIN_EXCHANGE_RATE: 'currencies-admin-exchange-history',
    EXCHANGE_UPDATE_TYPE: 'currencies-exchange-update-type'
  },
  REGISTRATION_FIELDS: {
    VIEW: 'registration-fields-view'
  },
  RELEASE_NOTES: {
    VIEW: 'release-notes-view'
  },
  FAQ: {
    VIEW: 'faq-view'
  },
  COMMISSION_SETTING: {
    UPDATE: 'commission-setting-update'
  },
  OPERATOR: {
    WALLET_VIEW: 'operator-wallet-view',
    WALLET_TRANSACTION_LIST: 'transaction-list',
    MENAGE_FUNDS: 'deposit-withdraw-fund',
    WITHDRAW_REQUESTS: 'operator-withdraw-requests-view',
    WITHDRAW_REQUESTS_EDIT: 'operator-withdraw-requests-edit'
  },
  AGENTS: {
    ADD: 'agent-add',
    EDIT: 'agent-edit',
    VIEW: 'agent-view',
    CHANGE_STATUS: 'agent-change-status',
    WALLET_MANAGE: 'agent-wallet-manage'
  }
};

export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PER_PAGE_RECORD = 10;

export const PROMOCODE = {
  TYPE: {
    EXACT_DEPOSIT: 0,
    DEPOSIT_IN_RANGE: 1
  }
};

export const BONUS_CAMPAIGN = {
  BONUS_TYPE: {
    FIXED: 0,
    PERCENTAGE: 1
  }
};

export const KYC_PROCESSING_MODE = {
  AUTO: 'auto',
  MANUAL: 'manual'
};

export const BANNER = {
  TYPE: {
    LOBBY_BANNER: 1
  }
};

export const GENERAL_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
};

export const ADMIN_TYPE = {
  ADMIN: 0,
  AGENT: 1
};

export const AGENT_TIER_TYPE = {
  TIER_1: 0,
  TIER_2: 1,
  TIER_3: 2
};

export const CREDIT_DEBIT_TYPE = {
  CREDIT: 0,
  DEBIT: 1
};

export const RESEND_OTP_TYPE = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  RESET_PASSWORD: 'RESET_PASSWORD'
};
