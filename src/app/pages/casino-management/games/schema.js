import * as yup from 'yup';

export const editGameSchema = yup.object().shape({
  // Game Information
  gameName: yup.string().required('Game name is required'),
  minBetAmount: yup
    .number()
    .typeError('Minimum bet amount must be a number')
    .positive('Minimum bet amount must be greater than 0')
    .required('Minimum bet amount is required')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  maxBetAmount: yup
    .number()
    .typeError('Maximum bet amount must be a number')
    .min(yup.ref('minBetAmount'), 'Maximum bet amount must be greater than minimum bet amount')
    .required('Maximum bet amount is required')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  categoryIds: yup.array().of(yup.number()).required('Category is required')
});
