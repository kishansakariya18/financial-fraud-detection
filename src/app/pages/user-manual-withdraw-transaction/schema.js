import * as Yup from 'yup';

export const createSchema = Yup.object().shape({
  amount: Yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required')
});
