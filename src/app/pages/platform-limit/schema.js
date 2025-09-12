import * as Yup from 'yup';

// Validate amounts as:
// - 1 to 10 digits before the decimal
// - Optional decimal part with up to 2 digits
// Using regex on the original input string avoids issues where very large numbers
// are coerced to exponential notation (e.g., 1e+21) when converted to a Number.
const AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/;

export const updatePlatformLimitSchema = Yup.object().shape({
  dailyDepositLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Daily Deposit Limit Must Be Positive')
    .required('Daily Deposit Limit Required')
    .test(
      'amount-format',
      'Enter minimum 1 to maximum 10 digits with up to 2 decimals (e.g., 1234567890.12)',
      function () {
        const original = this?.originalValue;
        if (original === undefined || original === null || original === '') return true;
        return AMOUNT_REGEX.test(String(original).trim());
      }
    ),
  dailyWithdrawLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Daily Withdraw Limit Must Be Positive')
    .required('Daily Withdraw Limit Required')
    .test(
      'amount-format',
      'Enter minimum 1 to maximum 10 digits with up to 2 decimals (e.g., 1234567890.12)',
      function () {
        const original = this?.originalValue;
        if (original === undefined || original === null || original === '') return true;
        return AMOUNT_REGEX.test(String(original).trim());
      }
    ),
  oneTimeBetLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('One Time Bet Limit Must Be Positive')
    .required('One Time Bet Limit Required')
    .test(
      'amount-format',
      'Enter minimum 1 to maximum 10 digits with up to 2 decimals (e.g., 1234567890.12)',
      function () {
        const original = this?.originalValue;
        if (original === undefined || original === null || original === '') return true;
        return AMOUNT_REGEX.test(String(original).trim());
      }
    ),
  oneTimeWinLimit: Yup.number('Value must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('One Time Win Limit Must Be Positive')
    .required('One Time Win Limit Required')
    .test(
      'amount-format',
      'Enter minimum 1 to maximum 10 digits with up to 2 decimals (e.g., 1234567890.12)',
      function () {
        const original = this?.originalValue;
        if (original === undefined || original === null || original === '') return true;
        return AMOUNT_REGEX.test(String(original).trim());
      }
    ),
  isCheckCalenderTime: Yup.boolean()
});
