import * as Yup from 'yup';

export const createUserClassSchema = Yup.object().shape({
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
  deposit: Yup.number()
    .typeError('Deposit must be a number')
    .min(0, 'Deposit cannot be negative')
    .required('Deposit is required')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  wager: Yup.number()
    .typeError('Wager must be a number')
    .min(0, 'Wager cannot be negative')
    .required('Wager is required')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    })
});
