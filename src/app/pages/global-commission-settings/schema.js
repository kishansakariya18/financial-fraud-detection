import * as Yup from 'yup';

const AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/;
const PERCENT_REGEX = /^\d{1,3}(\.\d{1,2})?$/; // up to 100 with 2 decimals

export const commissionSettingsSchema = Yup.object().shape({
  IsCPAAmountRequired: Yup.boolean(),
  IsLossCommissionPercentageRequired: Yup.boolean(),

  CPAAmount: Yup.mixed().when('IsCPAAmountRequired', {
    is: true,
    then: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? null : val))
        .min(0, 'Cannot be negative')
        .required('CPA Amount is required')
        .test('amount-format', 'Enter 1-10 digits with up to 2 decimals', function () {
          const original = this?.originalValue;
          if (original === undefined || original === null || original === '') return true;
          return AMOUNT_REGEX.test(String(original).trim());
        }),
    otherwise: () => Yup.mixed().nullable()
  }),

  MinDepositForCPA: Yup.mixed().when('IsCPAAmountRequired', {
    is: true,
    then: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? null : val))
        .min(0, 'Cannot be negative')
        .required('Min Deposit For CPA is required')
        .test('amount-format', 'Enter 1-10 digits with up to 2 decimals', function () {
          const original = this?.originalValue;
          if (original === undefined || original === null || original === '') return true;
          return AMOUNT_REGEX.test(String(original).trim());
        }),
    otherwise: () => Yup.mixed().nullable()
  }),

  MinWagerForCPA: Yup.mixed().when('IsCPAAmountRequired', {
    is: true,
    then: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? null : val))
        .min(0, 'Cannot be negative')
        .required('Min Wager For CPA is required')
        .test('amount-format', 'Enter 1-10 digits with up to 2 decimals', function () {
          const original = this?.originalValue;
          if (original === undefined || original === null || original === '') return true;
          return AMOUNT_REGEX.test(String(original).trim());
        }),
    otherwise: () => Yup.mixed().nullable()
  }),

  LossCommissionPercent: Yup.mixed().when('IsLossCommissionPercentageRequired', {
    is: true,
    then: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? null : val))
        .min(0, 'Cannot be negative')
        .max(100, 'Cannot exceed 100')
        .required('Loss Commission % is required')
        .test('percent-format', 'Enter up to 100 with up to 2 decimals', function () {
          const original = this?.originalValue;
          if (original === undefined || original === null || original === '') return true;
          return PERCENT_REGEX.test(String(original).trim());
        }),
    otherwise: () => Yup.mixed().nullable()
  })
});
