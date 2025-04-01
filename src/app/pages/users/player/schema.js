import * as Yup from 'yup';

export const playerLimitSchema = Yup.object().shape({
  dailyWagerLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Daily Wager Limit must be positive')
    .required('Daily Wager Limit is required'),
  weeklyWagerLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Weekly Wager Limit must be positive')
    .required('Weekly Wager Limit is required'),
  monthlyWagerLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Monthly Wager Limit must be positive')
    .required('Monthly Wager Limit is required'),

  dailyDepositLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Daily Deposit Limit must be positive')
    .required('Daily Deposit Limit is required'),
  weeklyDepositLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Weekly Deposit Limit must be positive')
    .required('Weekly Deposit Limit is required'),
  monthlyDepositLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Monthly Deposit Limit must be positive')
    .required('Monthly Deposit Limit is required'),

  dailyWithdrawLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Daily Withdraw Limit must be positive')
    .required('Daily Withdraw Limit is required'),
  weeklyWithdrawLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Weekly Withdraw Limit must be positive')
    .required('Weekly Withdraw Limit is required'),
  monthlyWithdrawLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Monthly Withdraw Limit must be positive')
    .required('Monthly Withdraw Limit is required'),

  dailyLossLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Daily Loss Limit must be positive')
    .required('Daily Loss Limit is required'),
  weeklyLossLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Weekly Loss Limit must be positive')
    .required('Weekly Loss Limit is required'),
  monthlyLossLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Monthly Loss Limit must be positive')
    .required('Monthly Loss Limit is required'),

  selfExclusionType: Yup.string().trim().required('Self Exclusion Type is required'),
  exclusionStartAt: Yup.date().required('Exclusion Start Date is required'),
  exclusionEndAt: Yup.date().required('Exclusion End Date is required'),

  // Flags
  hasDailyWagerLimit: Yup.boolean(),
  hasWeeklyWagerLimit: Yup.boolean(),
  hasMonthlyWagerLimit: Yup.boolean(),
  hasDailyDepositLimit: Yup.boolean(),
  hasWeeklyDepositLimit: Yup.boolean(),
  hasMonthlyDepositLimit: Yup.boolean(),
  hasDailyWithdrawLimit: Yup.boolean(),
  hasWeeklyWithdrawLimit: Yup.boolean(),
  hasMonthlyWithdrawLimit: Yup.boolean(),
  hasDailyLossLimit: Yup.boolean(),
  hasWeeklyLossLimit: Yup.boolean(),
  hasMonthlyLossLimit: Yup.boolean()
});
