export const apiConfig = {
    baseURL: {
      API_BASE_URL: import.meta.env.VITE_API_URL,
    },
    endPoints: {
      AUTH: {
        VALIDATE: '/admin/auth/validate',
        VERIFYOTP: '/admin/auth/login',
        RESENDOTP: '/admin/auth/resend-otp',
        CHANGE_PASSWORD: '/admin/auth/change-password',
        VALIDATE_RESET_PASSWORD: '/admin/auth/validate-reset-password',
        RESET_PASSWORD: '/admin/auth/reset-password'
      },
      ROLES: {
        LIST: '/admin/roles/list',
        PERMISSION_LIST: '/admin/roles/permission-list',
        SUBMIT: '/admin/roles/add-role',
        DETAIL: '/admin/roles/detail/:rolePermissionId',
        EDIT: '/admin/roles/update',
        DELETE: '/admin/roles/delete'
      },
      AUDIT_LOGS: {
        VIEW: '/admin/audit-logs/list'
      },
      USER_ENQUIRY: {
        LIST: '/admin/enquiry/list'
      },
      PAGE: {
        LIST: '/admin/pages/list',
        DETAIL: '/admin/pages/view/:pageId',
        TOGGLE_STATUS: '/admin/pages/change-status',
        EDIT: '/admin/pages/update'
      },
      USER: {
        SET_EXCLUSION: '/admin/user/:userID/set-exclusion',
        DETAIL: '/admin//users/detail/:userID',
        LIST: '/admin/users/list',
        REFERRAL_LIST: '/admin/users/referral/:userID',
        FUND: '/admin/users/fund',
        TRANSACTION_LIST: '/admin/users/transaction-list',
        REAL_GAME_TRANSACTION_LIST: '/admin/users/real-game-transaction-list',
        WINNING_TRANSACTION_LIST: '/admin/users/winning-transaction-list',
        WITHDRAW_TRANSACTION_LIST: '/admin/users/withdraw-transaction-list',
        TDS_TRANSACTION_LIST: '/admin/users/tds-transaction-list',
        TDS_SUMMARY_TRANSACTION_LIST: '/admin/users/tds-summary-transaction-list',
        COIN_TRANSACTION_LIST: '/admin/users/coin-transaction-list',
        TRANSACTION_DETAIL: '/admin/users/transaction-detail',
        BASKETBALL_TRANSACTION_LIST: '/admin/users/basketball-transaction-list',
        RETRO_TRANSACTION_LIST: '/admin/users/retro-transaction-list',
        F1_TRANSACTION_LIST: '/admin/users/f1-transaction-list',
        COIN_MERCHANDISE_TRANSACTION_LIST: '/admin/users/coin-merchandise-transaction-list',
        CHANGE_STATUS: '/admin/users/change-status',
        JOINED_CONTEST: '/admin/users/joined-contest',
        REST_BANK_COUNT: '/admin/users/reset-bank-request-count',
        UPDATE_RISK_MANAGEMENT:'/admin/users/update-user-risk-management/:userID',
        ALL_TRANSACTION_LIST: '/admin/users/all-transaction-list',
        GET_COMMENT: '/admin/users/get-comment',
        UPDATE_COMMENT: '/admin/users/update-comment',
        LOGIN_HISTORY: '/admin/users/:userID/login-history',
        GET_COMMENT_DETAIL: '/admin/users/get-comment-detail',
        ADD_COMMENT: '/admin/users/add-comment',
        DELETE_COMMENT: '/admin/users/delete-comment',
  
      },
      ADMIN_USER: {
        ADMIN_LIST: '/admin/admin/list',
        ADMIN_CHANGE_STATUS: '/admin/admin/:adminId/change-status',
        ADMIN_ROLE_LIST: '/admin/admin/role/list',
        ADMIN_CREATE: '/admin/admin/create',
        ADMIN_DELETE: `/admin/admin/:adminId/delete`,
        ADMIN_DETAIL: '/admin/admin/:adminId/details',
        ADMIN_LOGIN: '/admin/login',
        ADMIN_LOGIN_HISTORY: '/admin/admin/:adminID/login-history',
        ADMIN_DASHBOARD: '/dashboard',
        ADMIN_CHANGE_PASSWORD: '/auth/update-password',
        ADMIN_APPSETTINGS: '/admin/appSetting',
        ADMIN_CHECK_PASSWORD: '/admin/check-password',
        ADMIN_PERMISSION: '/admin/permissions',
        ADMIN_EDIT: '/admin/admin/edit',
        UPDATE_PROFILE: '/admin/update-profile',
        ADMIN_COUNTRY_LIST: '/admin/countries',
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
        TOP_GAMES: '/admin/dashboard/top-games'
      },
      MATCH: {
        LIST: '/admin/v1/match/list',
        PIN_MATCH: '/admin/v1/match/:matchId/pin-match',
        SHOW_HIDE_MEGA_LABEL: '/admin/v1/match/:matchId/show-maga-label',
        STOP_PRIZE_DISTRIBUTION: '/admin/v1/match/:matchId/stop-prize-distribution',
        MATCH_ACTION: '/admin/v1/match/:matchId/match-actions',
        CANCEL_MATCH: '/admin/v1/match/:matchId/cancel-match',
        SILENT_DELAY: '/admin/v1/match/add-silent-delay',
        MATCH_DELAY: '/admin/v1/match/add-match-delay',
        ANNOUNCEMENT: '/admin/v1/match/add-announcement',
        PUBLISH: '/admin/v1/match/:matchId/publish-match',
        SUBMIT_PUBLISHED_ROSTERS: '/admin/v1/match/publish-match',
        CREATE_RETRO_MATCH: '/v1/admin-retro-matches/clone-match',
        MATCH_STATS: '/admin/v1/match/:matchId/match-stats',
        ADD_EDIT_IMAGES: '/admin/v1/match/:matchId/add-image-match',
        GET_IMAGES: '/admin/v1/match/:matchId/images',
        REMOVE_IMAGES: '/admin/v1/match/:matchId/remove-images'
      },
      TEAM: {
        USER_TEAM_DETAIL: '/admin/v1/contest/:userContestId/user-team-details',
        LIST: '/admin/v1/team/team-list',
        EDIT: '/admin/v1/team/edit'
      },
      PLAYER: {
        LIST: '/admin/v1/player/list',
        EDIT: '/admin/v1/player/edit',
        PLAYER_POINT_BREAK_UP: '/admin/v1/match/match-stats/player-points-breakdown/:rosterTeamId'
      },
      SCORING_RULE: {
        LIST: '/admin/v1/scoring-rule/list'
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
        PROMOCODE_DELETE: '/admin/v1/deposit-promocode/:promocodeId'
      },
      CONTEST: {
        LIST: '/admin/v1/contest/list',
        TYPE_LIST: '/admin/v1/contest/categories',
        PIN_CONTEST: '/admin/v1/contest/:contestId/pin-contest',
        CANCEL_CONTEST: '/admin/v1/contest/:contestId/cancel-contest',
        DETAIL: '/admin/v1/contest/:contestId/details',
        DELETE_CONTEST: '/admin/v1/contest/:contestId/delete-contest',
        GET_JOIN_BENEFIT: '/admin/v1/contest/:contestId/get-join-benefit-contest',
        SUBMIT_JOIN_BENEFIT: '/admin/v1/contest/save-join-benefit-contest',
        DELETE_JOIN_BENEFIT: '/admin/v1/contest/:contestId/remove-join-benefit-contest',
        GET_APPLY_CONTEST_TEMPLATE: '/admin/v1/match/:matchId/match-templates',
        APPLY_CONTEST_TEMPLATE: '/admin/v1/match/apply-template',
        DYNAMIC_ENTRY_FEE: '/admin/v1/contest/:contestId/dynamic-entry-fee',
        SUBMIT_DYNAMIC_ENTRY_FEE: '/admin/v1/contest/dynamic-entry-fee',
        REPUBLISH_CONTEST: '/admin/v1/contest/republish-contest',
        CARDS: '/admin/v1/contest/:match_id/cards',
        ADD_EDIT_IMAGES: '/admin/v1/contest/:contestId/add-images',
        GET_IMAGES: '/admin/v1/contest/:contestId/images',
        REMOVE_IMAGES: '/admin/v1/contest/:contestId/remove-images',
        EXPORT_MATCH_REPORT: '/admin/v1/match/:match_id/export-report'
      },
      CONTEST_CATEGORY: {
        LIST: '/admin/v1/contest-category/list',
        EDIT: '/admin/v1/contest-category/:contest_category_id',
        CHANGE_STATUS: '/admin/v1/contest-category/:contest_category_id/change-status',
        LIST_WITHOUT_PAGINATION: '/admin/v1/contest/categories',
        REORDERING: '/admin/v1/contest-category/reorder',
        CREATE: '/admin/v1/contest-category/create'
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
        BANNER_EDIT: `/admin/banner/edit`,
        GET_BANNER_SGMENTATION: `/admin/banner/:bannerId/segmentation`,
        SUBMIT_BANNER_SEGMENTATION: `/admin/banner/:bannerId/segmentation`,
        REMOVE_BANNER_SEGMENTATION: `/admin/banner/:bannerId/segmentation`
      },
      BASKETBALL: {
        CONTEST: {
          CATEGORY_LIST: '/admin/v1/contest/categories'
        },
        CONTEST_TEMPLATE: {
          CONTEST_TEMPLATE_LIST: '/admin/v1/contest-template/list',
          CONTEST_TEMPLATE_CREATE: '/admin/v1/contest-template/create',
          CONTEST_TEMPLATE_DETAIL: '/admin/v1/contest-template/:contestTemplateId/details',
          CONTEST_TEMPLATE_CHANGE_STATUS:
            '/admin/v1/contest-template/:contestTemplateId/change-status',
          CONTEST_TEMPLATE_SEGMENTATION_LIST:
            '/admin/v1/contest-template/:contestTemplateId/segmentation',
          CONTEST_TEMPLATE_UPLOAD_SEGMENTATION:
            '/admin/v1/contest-template/:contestTemplateId/segmentation',
          CONTEST_TEMPLATE_REMOVE_SEGMENTATION:
            '/admin/v1/contest-template/:contestTemplateId/segmentation',
          CONTEST_TEMPLATE_DIRECT_CONTEST: '/admin/v1/contest-template/create-match-contest'
        },
        PROMOCODE: {
          PROMOCODE_LIST: '/admin/v1/promocode/list',
          PROMOCODE_DETAIL: '/admin/v1/promocode/:promocodeId/details',
          PROMOCODE_CREATE: '/admin/v1/promocode/create',
          PROMOCODE_CHANGE_STATUS: '/admin/v1/promocode/:promocodeId/change-status',
          PROMOCODE_HISTORY: '/admin/v1/promocode/:promocodeId/history'
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
          PROMOCODE_DELETE: '/admin/v1/deposit-promocode/:promocodeId'
        }
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
        UPDATE: '/admin/email-template/update'
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
        DETAIL: '/admin/segmentation/:segmentationId/details',
        ADD_EDIT: '/admin/segmentation/add-edit',
        COUNTRY_LIST: '/admin/segmentation/countries',
        CHANGE_STATUS: '/admin/segmentation/:segmentationId/change-status',
      },
      COUNTRY: {
        LIST: '/admin/country/list',
        CHANGE_STATUS: '/admin/country/:countryId/change-status'
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
        CREATE: '/admin/casino-management/category/create',
        EDIT: '/admin/casino-management/category/:categoryId/edit',
        DELETE: '/admin/casino-management/category/:categoryId/delete',
        CHANGE_STATUS: '/admin/casino-management/category/:categoryId/change-status'
      },
      PROVIDER: {
        LIST: '/admin/casino-management/provider/list',
        CREATE: '/admin/casino-management/provider/create',
        EDIT: '/admin/casino-management/provider/:providerId/edit',
        DELETE: '/admin/casino-management/provider/:providerId/delete',
        CHANGE_STATUS: '/admin/casino-management/provider/:providerId/change-status',
        RESTRICTED_COUNTRY_LIST: '/admin/casino-management/provider/:providerId/restricted-country/list',
        COUNTRY_LIST: '/admin/casino-management/provider/:providerId/country/list',
        ADD_RESTRICTED_COUNTRY: '/admin/casino-management/provider/:providerId/restricted-country/add',
        REMOVE_RESTRICTED_COUNTRY: '/admin/casino-management/provider/:providerId/restricted-country/delete',
      },
      GAME: {
        LIST: '/admin/casino-management/games/list',
        CREATE: '/admin/casino-management/games/create',
        EDIT: '/admin/casino-management/games/:gameId/edit',
        CHANGE_STATUS: '/admin/casino-management/games/:gameId/change-status',
        DELETE: '/admin/casino-management/games/:gameId/delete',
        PROVIDER_LIST: '/admin/casino-management/games/providers',
        CATEGORY_LIST: '/admin/casino-management/games/categories',
      },
      REPORTS: {
        BETSLIP: '/admin/reports/betslip-transactions'
      }
    }
  };
  
  export default apiConfig;
  