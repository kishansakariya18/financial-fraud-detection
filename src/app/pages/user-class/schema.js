import * as Yup from 'yup';

const AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/;

export const createUserClassSchema = (isB2C) => {
  const schema = Yup.object().shape({
    // Personal Information
    className: Yup.string()
      .trim()
      .min(3, 'Class Name must be at least 3 characters')
      .max(20, 'Class Name must be at most 20 characters')
      .required('Class Name Required'),
    classCode: Yup.string()
      .trim()
      .min(3, 'Class Code must be at least 3 characters')
      .max(20, 'Class Code must be at most 20 characters')
      .required('Class Code Required'),
    deposit: Yup.number('Deposit Amount must be a number')
      .transform((val) => (isNaN(val) ? null : val))
      .positive('Deposit Amount must be positive')
      .required('Deposit Amount is required')
      .test(
        'amount-format',
        'Enter minimum 1 to maximum 10 digits with up to 2 decimals (e.g., 1234567890.12)',
        function () {
          const original = this?.originalValue;
          if (original === undefined || original === null || original === '') return true;
          return AMOUNT_REGEX.test(String(original).trim());
        }
      ),
    wager: Yup.number('Wager Amount must be a number')
      .transform((val) => (isNaN(val) ? null : val))
      .positive('Wager Amount must be positive')
      .required('Wager Amount is required')
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

  if (isB2C) {
    schema.fields.deposit.required('Deposit is required').min(0, 'Deposit cannot be negative');
  }

  return schema;
};
