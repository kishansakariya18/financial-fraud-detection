export const PAGE_HELP_KEYS = {
  PLATFORM_LIMIT: 'platform-limit'
};

export const pageHelpConfig = {
  [PAGE_HELP_KEYS.PLATFORM_LIMIT]: (t) => ({
    title: `${t('platform')} ${t('limit')}`,
    sections: [
      {
        title: t('dailyDepositLimitPlatform'),
        description: t('dailyDepositLimitPlatformDesc'),
        relatedFields: ['dailyDepositLimit']
      },
      {
        title: t('dailyWithdrawLimitPlatform'),
        description: t('dailyWithdrawLimitPlatformDesc'),
        relatedFields: ['dailyWithdrawLimit']
      },
      {
        title: t('oneTimeBetLimitPlatform'),
        description: t('oneTimeBetLimitPlatformDesc'),
        relatedFields: ['oneTimeBetLimit']
      },
      {
        title: t('oneTimeWinLimitPlatform'),
        description: t('oneTimeWinLimitPlatformDesc'),
        relatedFields: ['oneTimeWinLimit']
      },
      {
        title: t('checkCalenderTime'),
        description: t('checkCalenderTimeDesc'),
        relatedFields: ['isCheckCaladerTime']
      }
    ]
  })
};
