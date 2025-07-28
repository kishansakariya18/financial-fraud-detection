import * as yup from 'yup';

export const editGameSchema = yup.object().shape({
  // Game Information
  gameName: yup.string().required('Game name is required'),
  minBetAmount: yup
    .number()
    .typeError('Minimum bet amount must be a number')
    .positive('Minimum bet amount must be greater than 0')
    .required('Minimum bet amount is required'),
  maxBetAmount: yup
    .number()
    .typeError('Maximum bet amount must be a number')
    .min(yup.ref('minBetAmount'), 'Maximum bet amount must be greater than minimum bet amount')
    .required('Maximum bet amount is required'),
  categoryIds: yup.array().of(yup.number()).required('Category is required')
});
