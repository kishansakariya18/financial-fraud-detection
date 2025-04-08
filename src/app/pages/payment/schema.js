import * as Yup from 'yup';

export const createPaymentSchema = Yup.object().shape({
  userUID: Yup.string().trim().required('User UID Required'),
  amount: Yup.number('Amount must be number')
    .transform((val) => (isNaN(val) ? null : val))
    .required('Amount Required')
    .positive('Amount Must Be Positive'),
  payment: Yup.number().required('Select Payment Option'),
  paymentStatus: Yup.number().required('Select Status')
});
