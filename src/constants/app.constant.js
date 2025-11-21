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
  IDENTITY: 1,
  SOURCE_OF_FUND: 2,
  ADDRESS: 3
};

export const DOCUMENT_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2
};

export const PERMISSIONS = Object.freeze({
  BONUS_CAMPAIGN: {
    ADD: 'bonus-campaign-add',
    VIEW: 'bonus-campaign-view',
    CHANGE_STATUS: 'bonus-campaign-change-status',
    VIEW_GRANTS: 'bonus-campaign-view-grants',
    VIEW_GRANT_WAGERING: 'bonus-campaign-view-grant-wagering',
    MANAGE_GRANTS: 'bonus-campaign-manage-grants'
  },

  ADMIN: {
    LIST: 'admin-view',
    CREATE: 'admin-add',
    EDIT: 'admin-edit',
    DELETE: 'admin-delete',
    CHANGE_STATUS: 'admin-change-status',
    VIEW_LOGIN_HISTORY: 'admin-login-history-view'
  },
  SUPERVISOR: {
    LIST: 'supervisor-view'
  },
  CALLING_AGENT: {
    LIST: 'calling-agent-view',
    EDIT: 'calling-agent-edit',
    ADD: 'calling-agent-add',
    DELETE: 'calling-agent-delete'
  },
  AGENTS: {
    ADD: 'agent-add',
    EDIT: 'agent-edit',
    VIEW: 'agent-view',
    CHANGE_STATUS: 'agent-change-status',
    MANAGE_FUND: 'agent-wallet-manage'
  },
  USER_LIMIT_SETTING: {
    UPDATE: 'limit-setting-update'
    // MODULE_NAME: this.MODULE_NAMES.USERS
  },

  USER: {
    LIST: 'user-view',
    WALLET_LIST: 'user-wallet-list',
    ADD_MONEY: 'user-add-money',
    CHANGE_STATUS: 'user-change-status',
    TRANSACTION_LIST: 'user-transaction',
    GAMES: 'user-games',
    VIEW_REFERRAL: 'user-referral',
    EXPORT_USER: 'users-export',
    RESET_BANK_REQUEST_COUNT: 'user-reset-bank-request-count',
    COMMENT_VIEW: 'user-comment-view',
    COMMENT_ADD: 'user-comment-add',
    COMMENT_EDIT: 'user-comment-edit',
    COMMENT_DELETE: 'user-comment-delete',
    ALL_TRANSACTION: 'all-transaction',
    VIEW_LOGIN_HISTORY: 'user-login-history-view',
    USER_LEVEL_LIMITS: 'user-level-risk-mangement',
    USER_SUMMARY: 'user-summary',
    UPGRADE_USER_CLASS: 'user-class-upgrade-user-class',
    LIMIT_USER_SUMMARY: 'limit-user-summary',
    RESPONSIBLE_GAMING_VIEW: 'user-responsible-gaming-view',
    RESPONSIBLE_GAMING_EDIT: 'user-responsible-gaming-edit',
    RESPONSIBLE_GAMING_DELETE: 'user-responsible-gaming-delete'
  },
  BANNER: {
    LIST: 'banner-view',
    ADD: 'banner-add',
    EDIT: 'banner-edit',
    DELETE: 'banner-delete',
    CHANGE_STATUS: 'banner-change-status'
  },

  LAYOUTS: {
    VIEW: 'layout-theme-view',
    ADD: 'layout-theme-add',
    EDIT: 'layout-theme-edit',
    STATUS: 'layout-theme-status'
  },
  DASHBOARD: {
    CARDS: 'dashboard-cards',
    DEPOSIT_STATS: 'dashboard-deposit-stats',
    WITHDRAW_STATS: 'dashboard-withdraw-stats',
    CASINO_STATS: 'dashboard-casino-stats',
    GGR_REPORT: 'dashboard-ggr-report',
    LOGGED_IN_PLAYERS: 'dashboard-logged-in-players',
    ACTIVE_PLAYERS: 'dashboard-active-players',
    DEMOGRAPHIC_REPORT: 'dashboard-demographic-report',
    KPI_SUMMARY: 'dashboard-kpi-summary',
    TOP_PLAYERS: 'dashboard-top-players',
    TOP_GAMES: 'dashboard-top-games'
  },
  COUNTRIES: {
    VIEW: 'country-view',
    LIST: 'country-view',
    CHANGE_STATUS: 'country-change-status',
    ADD_REMOVE_COUNTRY_RESTRICTIONS: 'add-remove-country-restrictions',
    VIEW_RESTRICTIONS: 'view-country-restrictions',
    ADD_REMOVE_COUNTRY_MODULE_RESTRICTIONS: 'add-remove-country-module-restrictions',
    ADD_REMOVE_COUNTRY_PROVIDER_RESTRICTIONS: 'add-remove-country-provider-restrictions'
  },
  API_LOGS: {
    VIEW: 'api-logs-view'
  },
  AFFILIATES: {
    VIEW: 'affiliate-view',
    ADD: 'affiliate-add',
    EDIT: 'affiliate-edit',
    CHANGE_STATUS: 'affiliate-change-status',
    TRANSACTIONS: 'affiliate-transactions',
    USER_SIGNUP_LIST: 'affiliate-user-signup-list',
    PAYOUT: 'affiliate-payout',
    UPDATE_PAYTOUT: 'affiliate-payout-update',
    VIEW_LOGIN_HISTORY: 'affiliate-login-history-view',
    CAMPAIGN: {
      VIEW: 'affiliate-campaign-view',
      CHANGE_STATUS: 'affiliate-campaign-change-status'
    },
    COMMISSION_SETTING: {
      GLOBAL: {
        VIEW: 'affiliate-commission-setting-global-view',
        UPDATE: 'affiliate-commission-setting-global-update'
      },
      PER_AFFILIATE: {
        VIEW: 'affiliate-commission-setting-per-affiliate-view',
        UPDATE: 'affiliate-commission-setting-per-affiliate-update',
        DELETE: 'affiliate-commission-setting-per-affiliate-delete'
      }
    },
    REPORT: {
      COMMISSION_SUMMARY_EXPORT: 'affiliate-commission-summary-report-export',
      EXPORT: 'affiliate-campaign-report-export',
      REFFERED_USER_EXPORT: 'affiliate-referred-user-report-export'
    }
  },
  BONUS_TEMPLATES: {
    ADD: 'bonus-template-add',
    EDIT: 'bonus-template-edit',
    VIEW: 'bonus-template-view',
    DELETE: 'bonus-template-delete'
  },
  DEPOSIT_PROMO_CODE: {
    VIEW: 'deposit-promo-code-view',
    ADD: 'deposit-promo-code-add',
    CHANGE_STATUS: 'deposit-promo-code-change-status',
    USER_LIST: 'deposit-promo-code-users-list',
    UPLOAD_SEGMENTATION_CSV: 'deposit-promo-code-segmentation',
    DELETE: 'deposit-promo-code-delete',
    EDIT: 'deposit-promo-code-edit'
  },

  PROMO_CODE_REPORT: {
    VIEW: 'promo-code-reports-view',
    EXPORT: 'reports-promocode-export'
  },
  ROLES: {
    VIEW: 'roles-view',
    ADD: 'roles-add',
    EDIT: 'roles-edit',
    DELETE: 'role-delete'
  },
  SEGMENTATION: {
    LIST: 'segmentation-view',
    ADD: 'segmentation-add',
    EDIT: 'segmentation-add',
    CHANGE_STATUS: 'segmentation-change-status',
    PLAYER_LIST: 'segmentation-player-list'
  },
  PAYMENT: {
    WITHDRAW: 'withdraw',
    DEPOSIT: 'deposit',
    BETSLIP: 'betslip',
    WINNING: 'winning',
    MANUAL_WITHDRAW_VIEW: 'manual-withdraw-view',
    MANUAL_WITHDRAW_UPDATE: 'manual-withdraw-update'
  },
  USER_KYC: {
    VIEW: 'user-kyc-view',
    UPDATE_KYC: 'update-kyc',
    KYC_CONFIGURATIONS: 'map-level-provider'
  },

  REFERRAL_MANAGEMENT: {
    EDIT: 'setting-referral-amount-edit'
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
    VIEW_RESTRICTED_COUNTRY: 'provider-view-restricted-country'
  },
  GAME: {
    VIEW: 'game-view',
    CREATE: 'game-create',
    EDIT: 'game-edit',
    CHANGE_STATUS: 'game-chnage-status',
    DELETE: 'game-delete',
    ADD_SEGMENTATION: 'game-add-segmentation'
  },
  CURRENCY: {
    CREATE: 'currency-add',
    STATUS: 'currency-status',
    VIEW: 'currency-view',
    EDIT: 'currency-edit',
    EXCHANGE_RATE_HISTORY: 'currency-exchange-rate-history',
    EXCHANGE_UPDATE_TYPE: 'currency-exchange-update-type',
    EXCHANGE_RATE_EDIT: 'currency-exchange-rate-edit'
  },
  CRM: {
    VIEW: 'crm-view',
    SEND_NOTIFICATION: 'crm-send-notification'
  },
  FRONTEND: {
    VIEW: 'frontend-home-category-list',
    ADD_HOME_CATEGORY: 'frontend-home-add-category',
    EDIT_HOME_CATEGORY: 'frontend-home-edit-category',
    CHANGE_HOME_CATEGORY_STATUS: 'frontend-change-home-category-status',
    DELETE_HOME_GAME: 'frontend-delete-home-game',
    REORDER_HOME_CATEGORY: 'frontend-reorder-home-category',
    VIEW_HOME_GAMES: 'frontend-home-game-list',
    ADD_HOME_GAMES: 'frontend-add-home-games',
    CHANGE_HOME_GAME_STATUS: 'frontend-change-home-game-status',
    REORDER_HOME_GAMES: 'frontend-reorder-home-games',
    APPEARANCE_VIEW: 'frontend-view-appearance',
    ADD_APPEARANCE: 'frontend-add-appearance',
    CHANGE_APPEARANCE_STATUS: 'frontend-change-appearance-status'
  },
  TENANT: {
    VIEW: 'tenant-view',
    CREATE: 'tenant-create',
    CHANGE_STATUS: 'tenant-change-status'
  },
  USER_CLASS: {
    VIEW: 'user-class-view',
    CREATE: 'user-class-create',
    EDIT: 'user-class-edit',
    CHANGE_STATUS: 'user-class-change-status',
    DELETE: 'user-class-delete',
    MAP: 'deposit-bank-map'
  },
  USER_CLASS_LIMIT: {
    VIEW: 'user-class-limit-view',
    CREATE: 'user-class-limit-create',
    EDIT: 'user-class-limit-edit',
    DELETE: 'user-class-limit-delete'
  },
  SEGMENTATION_LIMIT: {
    VIEW: 'segmentation-limit-view',
    CREATE: 'segmentation-limit-create',
    EDIT: 'segmentation-limit-edit',
    DELETE: 'segmentation-limit-delete'
  },
  RATE_LIMIT_RULES: {
    LIST: 'rate-limit-list-view',
    EDIT: 'rate-limit-rules-edit',
    CHANGE_STATUS: 'rate-limit-rules-change-status'
  },
  RELEASE_NOTE: {
    ADD: 'release-note-add',
    EDIT: 'release-note-edit',
    VIEW: 'release-note-view',
    DELETE: 'release-note-delete',
    CHANGE_STATUS: 'release-note-change-status'
  },
  DEPOSIT_BANK: {
    ADD: 'deposit-bank-add',
    EDIT: 'deposit-bank-edit',
    VIEW: 'deposit-bank-view',
    CHANGE_STATUS: 'deposit-bank-change-status'
  },
  USER_BANK_DEPOSIT: {
    VIEW: 'user-bank-deposit-view',
    VERIFY: 'user-bank-deposit-verify'
  },
  BLACKLIST: {
    MODULE_NAME: 'Blacklist',
    CREATE: 'blacklist-create',
    VIEW: 'blacklist-view',
    DELETE: 'blacklist-delete',
    UPDATE: 'blacklist-update',
    VIEW_EMAIL_MOBILE_RESTRCTION: 'blacklist-view-restricted-email-mobile',
    DELETE_EMAIL_MOBILE_RESTRCTION: 'blacklist-delete-restricted-email-mobile',
    ADD_EMAIL_MOBILE_RESTRCTION: 'blacklist-add-restricted-email-mobile',
    ADD_RESTRICTED_EMAIL_DOMAIN: 'blacklist-add-restricted-email-domain',
    VIEW_RESTRICTED_EMAIL_DOMAIN: 'blacklist-view-restricted-email-domain',
    DELETE_RESTRICTED_EMAIL_DOMAIN: 'blacklist-delete-restricted-email-domain',
    UPDATE_RESTRICTED_EMAIL_DOMAIN: 'blacklist-update-restricted-email-domain'
  },
  PAYMENT_PROVIDER: {
    LIST: 'payment-provider-view',
    ADD: 'payment-provider-add',
    EDIT: 'payment-provider-edit',
    CHANGE_STATUS: 'payment-provider-status',
    DELETE: 'payment-provider-delete'
  },
  SMS_PROVIDER: {
    LIST: 'sms-provider-view',
    ADD: 'sms-provider-add',
    EDIT: 'sms-provider-edit',
    CHANGE_STATUS: 'sms-provider-status',
    DELETE: 'sms-provider-delete'
  },
  EMAIL_PROVIDER: {
    LIST: 'email-provider-view',
    ADD: 'email-provider-add',
    EDIT: 'email-provider-edit',
    CHANGE_STATUS: 'email-provider-status',
    DELETE: 'email-provider-delete'
  },
  APP_SETTING: {
    EDIT: 'app-setting-edit'
  },
  KYC_PROVIDER: {
    LIST: 'kyc-provider-view',
    ADD: 'kyc-provider-add',
    EDIT: 'kyc-provider-edit',
    CHANGE_STATUS: 'kyc-provider-status',
    DELETE: 'kyc-provider-delete'
  },
  REPORTS: {
    BETSLIP: {
      VIEW: 'betslip-report-view',
      EXPORT: 'betslip-export-report'
    },
    DEPOSIT: {
      VIEW: 'deposit-report-view',
      EXPORT: 'deposit-export-report'
    },
    WITHDRAW: {
      VIEW: 'withdraw-report-view',
      EXPORT: 'withdraw-export-report'
    },
    B2B_AGENT: {
      AGENT_COMMISSION_REPORT: 'agent-commission-report',
      AGENT_WALLET_REPORT: 'agent-wallet-report'
    }
  },
  EVENT_TEMPLATE: {
    VIEW: 'event-template-view',
    ADD: 'event-template-add',
    EDIT: 'event-template-edit',
    CHANGE_STATUS: 'event-template-status'
  },
  ASSIGN_EVENT_TEMPLATES: {
    UPDATE: 'assign-event-templates-update'
  },
  OPERATOR: {
    MANAGE_FUND: 'deposit-withdraw-fund',
    WALLET_VIEW: 'operator-wallet-view',
    WALLET_TRANSACTION_LIST: 'transaction-view',
    WITHDRAW_REQUESTS_VIEW: 'operator-withdraw-requests-view',
    WITHDRAW_REQUESTS_EDIT: 'operator-withdraw-requests-edit'
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
  FAQ: {
    VIEW: 'faq-view',
    ADD: 'faq-add',
    EDIT: 'faq-update',
    DELETE: 'faq-delete'
  },
  IP_LOOKUP: {
    VIEW: 'ip-lookup-view'
  },
  PAGE: {
    VIEW: 'page-view',
    ADD: 'page-add',
    EDIT: 'page-edit',
    CHANGE_STATUS: 'page-change-status',
    DELETE: 'page-delete'
  },
  AUDIT_LOGS: {
    VIEW: 'audit-logs-view'
  },
  AGGREGATORS: {
    VIEW: 'aggregator-view',
    FEED_GAMES: 'aggregator-feed-games'
  },
  RESPONSIBLE_GAMING_RESTRICTIONS: {
    VIEW: 'responsible-gaming-restrictions-view',
    CREATE: 'responsible-gaming-restrictions-create',
    EDIT: 'responsible-gaming-restrictions-edit',
    DELETE: 'responsible-gaming-restrictions-delete',
    APPROVE: 'responsible-gaming-restrictions-approve'
  },
  PLAYER_SEGMENTATION: {
    LIST: 'player-segmentation-view',
    ADD: 'player-segmentation-add',
    EDIT: 'player-segmentation-edit',
    CHANGE_STATUS: 'player-segmentation-change-status',
    DELETE: 'player-segmentation-delete'
  }
});

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
