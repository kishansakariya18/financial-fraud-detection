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
      then: (schema) => schema.required('Exact amount is required').positive('Must be positive')
    }),

  minAmount: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .nullable()
    .when('type', {
      is: (val) => +val === PROMOCODE.TYPE.DEPOSIT_IN_RANGE,
      then: (schema) => schema.required('Minimum amount is required').positive('Must be positive')
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
    }),

  discount: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required('Discount amount is required')
    .positive('Discount must be positive'),

  benefitCap: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .nullable()
    .when('type', {
      is: (val) => +val === PROMOCODE.TYPE.DEPOSIT_IN_RANGE,
      then: (schema) => schema.required('Benefit cap is required').positive('Must be positive')
    }),

  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required'),

  isOnlyFirstDeposit: Yup.boolean(),
  isOnlySecondDeposit: Yup.boolean(),

  promocodeQty: Yup.number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .min(1, 'Must be at least 1'),

  allowedPerUser: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .nullable()
    .when(['isOnlyFirstDeposit', 'isOnlySecondDeposit'], {
      is: (first, second) => first === false && second === false,
      then: (schema) => schema.required('Allowed Per User is required').min(1, 'Must be at least 1')
    })
});
