export const BONUS_TYPE_OPTIONS = (t) => [
  { label: t('deposit_boost'), value: 'deposit_boost' },
  { label: t('free_chip'), value: 'free_chip' },
  { label: t('free_spins'), value: 'free_spins' }
];

export const BOOST_MODE_OPTIONS = (t) => [
  { label: t('fixed'), value: 'fixed' },
  { label: t('variable'), value: 'variable' }
];

export const WAGERING_MODE_OPTIONS = (t) => [
  { label: t('none'), value: 'none' },
  { label: t('fixed_amount'), value: 'fixed_amount' },
  { label: t('multiplier'), value: 'multiplier' }
];

export const WAGERING_BASE_OPTIONS_DEPOSIT_BOOST = (t) => [
  { label: t('deposit'), value: 'deposit' },
  { label: t('boost'), value: 'boost' },
  { label: t('deposit_plus_boost'), value: 'deposit_plus_boost' }
];

export const WAGERING_BASE_OPTIONS_FREE_CHIP = (t) => [
  { label: t('chip_amount'), value: 'chip_amount' }
];

export const WAGERING_BASE_OPTIONS_FREE_SPINS = (t) => [
  { label: t('winnings'), value: 'winnings' }
];

export const MCO_MODE_OPTIONS = (t) => [
  { label: t('none'), value: 'none' },
  { label: t('fixed_amount'), value: 'fixed_amount' },
  { label: t('multiplier'), value: 'multiplier' }
];

export const PAYMENT_METHOD_OPTIONS = (t) => [
  { label: t('all_payment_methods'), value: 'all' },
  { label: t('credit_card'), value: 'credit_card' },
  { label: t('crypto'), value: 'crypto' },
  { label: t('wallet'), value: 'wallet' }
];
export const createOptionLookup = (options = []) => {
  return options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});
};
