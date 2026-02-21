import * as yup from 'yup';

export const createTransactionSchema = yup.object().shape({
  amount: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Amount is required')
    .min(0, 'Amount must be at least 0'),
  type: yup.string().required('Transaction type is required'),
  categoryId: yup.string().required('Category is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  transactionDate: yup.date().required('Transaction date is required'),
  description: yup.string().nullable(),
  location: yup.object().shape({
    city: yup.string().nullable(),
    country: yup.string().nullable()
  })
});
