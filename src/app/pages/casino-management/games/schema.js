import * as yup from 'yup';

export const editGameSchema = yup.object().shape({
  // Personal Information
  gameName: yup.string().required('Game name is required'),
  minBetAmount: yup.string().trim(),
  maxBetAmount: yup.string().trim(),
  categoryIds: yup.array().of(yup.number()).required('Category is required')
});
