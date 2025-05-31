export const APP_NAME = 'Bet Nexus';
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
  LANGUAGE: 'language'
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
    ROLLBACK: 18
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
  REPORT: {
    BETSLIP_REPORT_VIEW: 'betslip-report-view',
    DEPOSIT_REPORT_VIEW: 'deposit-report-view',
    WITHDRAW_REPORT_VIEW: 'withdraw-report-view',
    BETSLIP_EXPORT_REPORT: 'betslip-export-report',
    DEPOSIT_EXPORT_REPORT: 'deposit-export-report',
    WITHDRAW_EXPORT_REPORT: 'withdraw-export-report',
    PLAYER_BALANCE_REPORT_VIEW: 'player-balance-report-view',
    PLAYER_BALANCE_EXPORT_REPORT: 'player-balance-export-report'
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
  CONTEST_TEMPLATE: {
    LIST: 'template-view',
    CREATE: 'template-add',
    SEGMENTATION: 'template-upload-segmentation-csv',
    COPY_TEMPLATE: 'matches-create-contest',
    CHANGE_STATUS: 'template-change-status',
    MATCH_CREATE_CONTEST: 'matches-create-contest'
  },
  MATCHES: {
    LIST: 'matches-view',
    MATCH_PUBLISH: 'matches-re-publish',
    PIN: 'matches-pin',
    APPLY_TEMPLATE: 'matches-apply-template',
    LINEUP: 'matches-playing-xi',
    MATCH_DELAY: 'matches-delay',
    GAMES: 'matches-games',
    CANCEL_MATCH: 'matches-cancel-game',
    ANNOUNCEMENT: 'matches-annoucement',
    MATCH_ACTIONS: 'matches-actions',
    STOP_PRIZE_DISTRIBUTION: 'matches-stopped-prize-distribution',
    ADD_SILENT_DELAY: 'matches-add-silent-delay',
    ADD_IMAGES: 'matches-add-images',
    ADD_RETRO_MATCH: 'retro-matches-add',
    SHOW_HIDE_MEGA_LABEL: 'matches-hide-mega-lebel'
  },
  CONTESTS: {
    PIN_CONTEST: 'matches-games-pin',
    CANCEL_CONTEST: 'matches-games-cancel',
    DELETE_CONTEST: 'matches-games-delete',
    CONTEST_JOIN_BENEFIT: 'matches-games-join-benifit',
    CONTEST_DYNAMIC_ENTRY: 'matches-games-add-dynamic-entry',
    CONTEST_ADD_IMAGES: 'matches-games-add-images',
    CONTEST_REPUBLISH: 'matches-games-republish-contest',
    CONTEST_PROMO_CODE: 'matches-games-promocode'
  },
  PLAYERS: {
    LIST: 'roster-view',
    EDIT: 'roster-edit'
  },
  TEAM: {
    LIST: 'team-view',
    EDIT: 'team-edit'
  },
  TOURNAMENTS: {
    LIST: 'tournament-view',
    CHANGE_STATUS: 'tournament-change-status',
    EDIT: 'tournament-edit',
    DEFAULT_CONTESTS: 'tournament-default-game-view'
  },
  FANTASYPOINT: {
    LIST: 'fantasypoint-view',
    EDIT: 'fantasypoint-edit'
  },
  CONTEST_CATEGORY: {
    ADD: 'contestcategory-add',
    EDIT: 'contestcategory-edit',
    CHANGE_STATUS: 'contestcategory-change-status',
    SET_ORDERING: 'contestcategory-set-ordering',
    LIST: 'contestcategory-view'
  },
  SCORING_RULE: {
    LIST: 'scoring-rules-view'
  },
  CONTEST_PROMOCODE: {
    LIST: 'contest-promo-code-view',
    USER_LIST: 'contest-promo-code-player-list',
    CHANGE_STATUS: 'contest-promo-code-change-status',
    DELETE: 'contest-promo-code-delete'
  },
  SETTINGS: {
    BANNED_STATE: {
      LIST: 'setting-banned-state-view',
      ADD: 'setting-banned-state-add',
      DELETE: 'setting-banned-state-delete'
    },
    DEPOSIT_OFFER: {
      LIST: 'setting-deposit-offers-view',
      ADD: 'setting-deposit-offers-add',
      DELETE: 'setting-deposit-offers-delete',
      CHANGE_STATUS: 'setting-deposit-offers-change-status'
    },
    MERCHANDISE: {
      LIST: 'setting-merchandise-view',
      ADD: 'setting-merchandise-add',
      EDIT: 'setting-merchandise-edit',
      CHANGE_STATUS: 'setting-merchandise-change-status',
      WINNER_LIST: 'setting-merchandise-winner-list'
    },
    USER_KYC: {
      LIST: 'setting-users-kyc-view'
    }
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
  EMAIL_TEMPLATE: {
    LIST: 'setting-email-template-view',
    ADD: 'setting-email-template-add',
    EDIT: 'setting-email-template-edit'
  },
  REFERRAL_OFFERS: {
    VIEW: 'setting-referral-amount-view'
  },
  COIN: {
    MERCHANDISE: {
      VIEW: 'coin-merchandise-view',
      EDIT: 'coin-merchandise-edit',
      ADD: 'coin-merchandise-add',
      STATUS: 'coin-merchandise-change-status',
      DELETE: 'coin-merchandise-delete'
    },
    PACKAGE: {
      LIST: 'coin-package-view',
      ADD: 'coin-package-add',
      CHANGE_STATUS: 'coin-package-change-status',
      DELETE: 'coin-package-delete'
    },
    CONFIG: ''
  },
  API_LOGS: 'api-logs-view',
  SEGMENTATION: {
    LIST: 'segmentation-view',
    ADD: 'segmentation-add',
    EDIT: 'segmentation-add',
    CHANGE_STATUS: 'segmentation-change-status',
    PLAYER_LIST: 'segmentation-player-list'
  },
  COMMUNICATION_DASHBOARD: {
    LIST: 'ublist-view',
    ADD: 'ublist-add',
    EDIT: 'ublist-edit'
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
    VIEW_LOGIN_HISTORY: 'affiliate-login-history-view'
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
    VIEW_RESTRICTED_COUNTRY: 'provider-view-restricted-country'
  },
  GAME: {
    VIEW: 'game-view',
    CREATE: 'game-create',
    EDIT: 'game-edit',
    CHANGE_STATUS: 'game-chnage-status',
    DELETE: 'game-delete'
  },
  CRM: {
    VIEW: 'crm-view'
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
    CHANGE_APPEARANCE_STATUS: 'frontend-change-appearance-status'
  },
  BUX_AI: {
    VIEW: 'bux-ai-view'
  },
  TENANT: {
    VIEW: 'tenant-view',
    CREATE: 'tenant-create',
    CHANGE_STATUS: 'tenant-change-status'
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
