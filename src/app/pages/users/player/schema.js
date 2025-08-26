import * as Yup from 'yup';

export const playerLimitSchema = Yup.object().shape({
  // Wager Limits
  oneTimeWagerLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasOneTimeWagerLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('One-time Wager Limit is required')
          .positive('One-time Wager Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  dailyWagerLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasDailyWagerLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('Daily Wager Limit is required')
          .positive('Daily Wager Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  weeklyWagerLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasWeeklyWagerLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('Weekly Wager Limit is required')
          .positive('Weekly Wager Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  monthlyWagerLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasMonthlyWagerLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('Monthly Wager Limit is required')
          .positive('Monthly Wager Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  // Deposit Limits
  dailyDepositLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasDailyDepositLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('Daily Deposit Limit is required')
          .positive('Daily Deposit Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  weeklyDepositLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasWeeklyDepositLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('Weekly Deposit Limit is required')
          .positive('Weekly Deposit Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  monthlyDepositLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasMonthlyDepositLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('Monthly Deposit Limit is required')
          .positive('Monthly Deposit Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  // Withdraw Limits
  dailyWithdrawLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasDailyWithdrawLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('Daily Withdraw Limit is required')
          .positive('Daily Withdraw Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  weeklyWithdrawLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasWeeklyWithdrawLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('Weekly Withdraw Limit is required')
          .positive('Weekly Withdraw Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  monthlyWithdrawLimit: Yup.number()
    .transform((val, originalVal) => (originalVal === '' ? 0 : val))
    .when('hasMonthlyWithdrawLimit', {
      is: true,
      then: (schema) =>
        schema
          .required('Monthly Withdraw Limit is required')
          .positive('Monthly Withdraw Limit must be positive'),
      otherwise: (schema) =>
        schema
          .nullable()
          .test(
            'is-empty-or-positive',
            'Value must be zero or positive value',
            (val) => val === null || val >= 0
          )
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  // Exclusion
  selfExclusionType: Yup.number().nullable(),
  exclusionStartAt: Yup.date().when('selfExclusionType', {
    is: (type) => type !== null && +type === 6,
    then: (schema) => schema.required('Self Exclusion Start At is required'),
    otherwise: (schema) => schema.nullable()
  }),
  exclusionEndAt: Yup.date().when('selfExclusionType', {
    is: (type) => type !== null && +type === 6,
    then: (schema) => schema.required('Self Exclusion End At is required'),
    otherwise: (schema) => schema.nullable()
  }),

  // Flags
  hasOneTimeWagerLimit: Yup.boolean(),
  hasDailyWagerLimit: Yup.boolean(),
  hasWeeklyWagerLimit: Yup.boolean(),
  hasMonthlyWagerLimit: Yup.boolean(),
  hasDailyDepositLimit: Yup.boolean(),
  hasWeeklyDepositLimit: Yup.boolean(),
  hasMonthlyDepositLimit: Yup.boolean(),
  hasDailyWithdrawLimit: Yup.boolean(),
  hasWeeklyWithdrawLimit: Yup.boolean(),
  hasMonthlyWithdrawLimit: Yup.boolean()
});

export const manageFundSchema = Yup.object().shape({
  // Personal Information
  amount: Yup.number('Amount Must Be number')
    .transform((val) => (isNaN(val) ? null : val))
    .required('Amount Required')
    .positive('Amount Must Be Positive')
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  fundType: Yup.string().trim().required('Fund Type Required'),
  fundMessage: Yup.string()
    .trim()
    .required('Fund Message Required')
    .max(100, 'Fund Message Should Not More Than 100 Characters'),
  type: Yup.string().trim().required('Type Required'),
  currency: Yup.string().trim().required('Select Currency')
});
