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
        .moreThan(0, 'CPA Amount must be greater than 0')
        .required('CPA Amount is required')
        .test(
          'amount-format',
          'Enter a valid amount (up to 10 digits and 2 decimals)',
          function () {
            const original = this?.originalValue;
            if (original === undefined || original === null || original === '') return true;
            return AMOUNT_REGEX.test(String(original).trim());
          }
        ),
    otherwise: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? 0 : val))
        .oneOf([0], 'CPA Amount must be 0 when CPA is disabled')
  }),

  MinDepositForCPA: Yup.mixed().when('IsCPAAmountRequired', {
    is: true,
    then: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? null : val))
        .moreThan(0, 'Min Deposit For CPA must be greater than 0')
        .required('Min Deposit For CPA is required')
        .test(
          'amount-format',
          'Enter a valid amount (up to 10 digits and 2 decimals)',
          function () {
            const original = this?.originalValue;
            if (original === undefined || original === null || original === '') return true;
            return AMOUNT_REGEX.test(String(original).trim());
          }
        ),
    otherwise: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? 0 : val))
        .oneOf([0], 'Min Deposit For CPA must be 0 when CPA is disabled')
  }),

  MinWagerForCPA: Yup.mixed().when('IsCPAAmountRequired', {
    is: true,
    then: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? null : val))
        .moreThan(0, 'Min Wager For CPA must be greater than 0')
        .required('Min Wager For CPA is required')
        .test(
          'amount-format',
          'Enter a valid amount (up to 10 digits and 2 decimals)',
          function () {
            const original = this?.originalValue;
            if (original === undefined || original === null || original === '') return true;
            return AMOUNT_REGEX.test(String(original).trim());
          }
        ),
    otherwise: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? 0 : val))
        .oneOf([0], 'Min Wager For CPA must be 0 when CPA is disabled')
  }),

  LossCommissionPercent: Yup.mixed().when('IsLossCommissionPercentageRequired', {
    is: true,
    then: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? null : val))
        .moreThan(0, 'Loss Commission % must be greater than 0')
        .max(100, 'Loss Commission % cannot exceed 100')
        .required('Loss Commission % is required')
        .test(
          'percent-format',
          'Enter a valid percentage (0-100 with up to 2 decimals)',
          function () {
            const original = this?.originalValue;
            if (original === undefined || original === null || original === '') return true;
            return PERCENT_REGEX.test(String(original).trim());
          }
        ),
    otherwise: () =>
      Yup.number('Value must be a number')
        .transform((val) => (isNaN(val) ? 0 : val))
        .oneOf([0], 'Loss Commission % must be 0 when disabled')
  })
});
