import { PROMOCODE } from 'constants/app.constant';
import * as Yup from 'yup';

export const createPromocodeSchema = Yup.object().shape({
  promocode: Yup.string().trim().required('Promocode is required'),

  type: Yup.mixed().required('Type is required'),

  exactAmount: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .nullable()
    .when('type', {
      is: (val) => +val === PROMOCODE.TYPE.EXACT_DEPOSIT,
      then: (schema) =>
        schema
          .required('Exact amount is required')
          .typeError('Exact Amount must be a number')
          .positive('Must be positive')
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  minAmount: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .nullable()
    .when('type', {
      is: (val) => +val === PROMOCODE.TYPE.DEPOSIT_IN_RANGE,
      then: (schema) => schema.required('Minimum amount is required').positive('Must be positive')
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  maxAmount: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .nullable()
    .when('type', {
      is: (val) => +val === PROMOCODE.TYPE.DEPOSIT_IN_RANGE,
      then: (schema) =>
        schema
          .required('Maximum amount is required')
          .moreThan(Yup.ref('minAmount'), 'Maximum must be more than minimum')
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  discount: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required('Discount amount is required')
    .positive('Discount must be positive')
    .integer('Discount must be a whole number')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  benefitCap: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .nullable()
    .typeError('Benefit cap must be a number')
    .when('type', {
      is: (val) => +val === PROMOCODE.TYPE.DEPOSIT_IN_RANGE,
      then: (schema) => schema.required('Benefit cap is required').positive('Must be positive')
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),

  isOnlyFirstDeposit: Yup.boolean(),
  isOnlySecondDeposit: Yup.boolean(),

  promocodeQty: Yup.number()
    .required('Quantity is required')
    .typeError('Quantity must be a number')
    .min(1, 'Must be at least 1')
    .integer('Quantity must be a whole number'),

  allowedPerUser: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .nullable()
    .when(['isOnlyFirstDeposit', 'isOnlySecondDeposit', 'promocodeQty'], {
      is: (first, second) => first === false && second === false,
      then: (schema) => schema.required('Allowed Per User is required').min(1, 'Must be at least 1')
    })
    .when(['promocodeQty'], (qty, schema) =>
      schema.max(qty, 'Allowed Per User cannot be more than PromoCode Quantity')
    )
    .integer('Allowed Per User must be a whole number'),

  wagering: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value)) // allow empty string to become undefined
    .nullable()
    .notRequired()
    .typeError('Wagering must be a number')
    .min(2, 'Wagering must be greater than 1')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  wagerFreeBounus: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value)) // allow empty string to become undefined
    .nullable()
    .notRequired()
    .typeError('Wager-Free Bounu must be a number')
    .min(1, 'Wager-Free Bounu must be greater than 1')
    .max(100, 'Wager-Free Bounu must be less than equals to 100')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    })
});
