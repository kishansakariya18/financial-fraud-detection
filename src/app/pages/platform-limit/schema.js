import * as Yup from 'yup';

export const updatePlatformLimitSchema = Yup.object().shape({
  dailyDepositLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Daily Deposit Limit Must Be Positive')
    .required('Daily Deposit Limit Required')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  dailyWithdrawLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Daily Withdraw Limit Must Be Positive')
    .required('Daily Withdraw Limit Required')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  oneTimeBetLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('One Time Bet Limit Must Be Positive')
    .required('One Time Bet Limit Required')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  oneTimeWinLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('One Time Win Limit Must Be Positive')
    .required('One Time Win Limit Required')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  isCheckCalenderTime: Yup.boolean()
});
