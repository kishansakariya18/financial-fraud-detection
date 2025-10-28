import * as Yup from 'yup';

// Validate amounts as:
// - 1 to 10 digits before the decimal
// - Optional decimal part with up to 2 digits
// Using regex on the original input string avoids issues where very large numbers
// are coerced to exponential notation (e.g., 1e+21) when converted to a Number.
const AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/;

export const createUserClassLimitSchema = Yup.object().shape({
  limitType: Yup.string().trim().required('Limit Type is required'),
  limitPeriod: Yup.string().trim().required('Limit Period is required'),
  limitAmount: Yup.number('Limit Amount must be a number')
    .transform((val) => (isNaN(val) ? null : val))
    .positive('Limit Amount must be positive')
    .required('Limit Amount is required')
    .test(
      'amount-format',
      'Enter minimum 1 to maximum 10 digits with up to 2 decimals (e.g., 1234567890.12)',
      function () {
        const original = this?.originalValue;
        if (original === undefined || original === null || original === '') return true;
        return AMOUNT_REGEX.test(String(original).trim());
      }
    )
});
