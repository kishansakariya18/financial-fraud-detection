import * as Yup from 'yup';

// export const createBonusCampaignSchema = (t) =>
//   Yup.object().shape({
//     campaignName: Yup.string().required(t('validation.required')),
//     campaignCode: Yup.string().required(t('validation.required')),
//     startDate: Yup.date().nullable().required(t('validation.required')),
//     endDate: Yup.date().nullable().min(Yup.ref('startDate'), t('validation.endDateAfterStart')),
//     claimMethod: Yup.string().required(t('validation.required')),
//     wageringRequirement: Yup.string().required(t('validation.required')),
//     minDeposit: Yup.number().min(0, t('validation.minValue', { min: 0 })),
//     maxBonus: Yup.number().min(0, t('validation.minValue', { min: 0 })),
//     bonusPercentage: Yup.number()
//       .min(0, t('validation.minValue', { min: 0 }))
//       .max(1000, t('validation.maxValue', { max: 1000 })),
//     maxWithdrawal: Yup.number().min(0, t('validation.minValue', { min: 0 })),
//     wageringMultiplier: Yup.number().min(0, t('validation.minValue', { min: 0 })),
//     maxBonusPerUser: Yup.number().min(0, t('validation.minValue', { min: 0 })),
//     maxUses: Yup.number().min(0, t('validation.minValue', { min: 0 }))
//   });

export const createBonusCampaignSchema = Yup.object().shape({
  campaignName: Yup.string().trim().required('Campaign Name is required'),
  campaignCode: Yup.string().trim().required('Campaign Code is required'),
  titleMessage: Yup.string().trim(),
  shortMessage: Yup.string().trim(),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  segmentationId: Yup.number(),
  wageringRequirement: Yup.string().required('Wagering Requirement is required'),
  wageringMultiplier: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .min(1, 'Wagering Multiplier must be greater than 0')
    .required('Wagering Mulitiplier is required'),

  bonusQuantity: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required('Quantity is required')
    .min(1, 'Must be at least 1')
    .integer('Quantity must be a whole number'),

  allowedPerUser: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required('Allowed Per User is required')
    .min(1, 'Must be at least 1')
    .nullable()
    .when(['bonusQuantity'], (qty, schema) =>
      schema.max(qty, 'Allowed Per User cannot be more than Bonus Quantity')
    )
    .integer('Allowed Per User must be a whole number'),

  minDepositAmount: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required('Minimum deposit amount is required')
    .positive('Must be positive')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  maxBonusAmount: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required('Maximum bonus amount is required')
    .nullable()
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  cashoutMultiplier: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .min(1, 'Wagering Multiplier must be greater than 0')
    .required('Wagering Mulitiplier is required'),

  bonusExpiryDays: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .min(1, 'Bonus Expiry Days must be greater than 0')
    .required('Bonus Expiry Days is required'),

  discount: Yup.number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required('Discount amount is required')
    .positive('Discount must be positive')
    .integer('Discount must be a whole number')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  eligibleCurrencies: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one currency')
    .required(),
  wageringCategories: Yup.array().of(Yup.number()).min(1, 'Select at least one category').required()
});
