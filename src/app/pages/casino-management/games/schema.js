import * as Yup from 'yup';

export const editGameSchema = Yup.object().shape({
  // Personal Information
  gameName: Yup.string().trim().required('Game Name Required'),
  minBetAmount: Yup.string().trim(),
  maxBetAmount: Yup.string().trim(),
  categoryId: Yup.number().required('Select Category')
});
