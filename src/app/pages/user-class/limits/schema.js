import * as Yup from 'yup';

export const createUserClassLimitSchema = Yup.object().shape({
  limitType: Yup.string().trim().required('Limit Type is required'),
  limitPeriod: Yup.string().trim().required('Limit Period is required'),
  limitAmount: Yup.number()
    .typeError('Limit Amount must be a number')
    .required('Limit Amount is required')
    .positive('Limit Amount must be positive')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    })
});
