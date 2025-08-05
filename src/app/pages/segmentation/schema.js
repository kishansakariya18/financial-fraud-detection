import * as Yup from 'yup';

export const createSegmentationSchema = Yup.object().shape({
  // Required base field
  name: Yup.string().trim().required('Name is required'),

  // KYC
  kyc: Yup.boolean(),
  kycType: Yup.string().when('kyc', {
    is: true,
    then: (schema) => schema.required('KYC Type is required'),
    otherwise: (schema) => schema.notRequired()
  }),

  // Country
  countryCheck: Yup.boolean(),
  countries: Yup.string().when('countryCheck', {
    is: true,
    then: (schema) => schema.required('Country is required'),
    otherwise: (schema) => schema.notRequired()
  }),

  // Age Group
  ageGroup: Yup.boolean(),
  minAge: Yup.number()
    .typeError('Minimum Age must be a number')
    .min(0, 'Minimum Age Must Be Positive')
    .integer('Age must be a whole number')
    .when('ageGroup', {
      is: true,
      then: (schema) => schema.required('Minimum Age is required'),
      otherwise: (schema) => schema.notRequired()
    }),
  maxAge: Yup.number()
    .typeError('Maximum Age must be a number')
    .min(0, 'Maximum Age Must Be Positive')
    .integer('Age must be a whole number')
    .when('ageGroup', {
      is: true,
      then: (schema) => schema.required('Maximum Age is required'),
      otherwise: (schema) => schema.notRequired()
    }),

  // Gender
  genderCheck: Yup.boolean(),
  gender: Yup.string().when('genderCheck', {
    is: true,
    then: (schema) => schema.required('Gender is required'),
    otherwise: (schema) => schema.notRequired()
  }),

  // Login Count
  loginCounter: Yup.boolean(),
  minLoginCount: Yup.number()
    .typeError('Minimum Login Count must be a number')
    .min(0, 'Minimum Login Count Must Be Positive')
    .integer('Login Count must be a whole number')
    .when('loginCounter', {
      is: true,
      then: (schema) => schema.required('Minimum Login Count is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-1-decimals', 'Login Count Must be a whole number', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,1})?$/.test(value.toString());
    }),
  maxLoginCount: Yup.number()
    .typeError('Maximum Login Count must be a number')
    .min(0, 'Maximum Login Count Must Be Positive')
    .integer('Login Count must be a whole number')
    .when('loginCounter', {
      is: true,
      then: (schema) => schema.required('Maximum Login Count is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-1-decimals', 'Login Count Must be a whole number', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,1})?$/.test(value.toString());
    }),

  // Referral
  referral: Yup.boolean(),
  minReferral: Yup.number()
    .typeError('Minimum Referral must be a number')
    .min(0, 'Minimum Referral Must Be Positive')
    .integer('Referral count must be a whole number')
    .when('referral', {
      is: true,
      then: (schema) => schema.required('Minimum Referral is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-1-decimals', 'Referral count Must be a whole number', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,1})?$/.test(value.toString());
    }),
  maxReferral: Yup.number()
    .typeError('Maximum Referral must be a number')
    .min(0, 'Maximum Referral Must Be Positive')
    .integer('Referral count must be a whole number')
    .when('referral', {
      is: true,
      then: (schema) => schema.required('Maximum Referral is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-1-decimals', 'Referral count Must be a whole number', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,1})?$/.test(value.toString());
    }),

  // Money Deposit
  moneyDeposit: Yup.boolean(),
  minDeposit: Yup.number()
    .typeError('Minimum Deposit must be a number')
    .min(0, 'Minimum Deposit Must Be Positive')
    .when('moneyDeposit', {
      is: true,
      then: (schema) => schema.required('Minimum Deposit is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  maxDeposit: Yup.number()
    .typeError('Maximum Deposit must be a number')
    .min(0, 'Maximum Deposit Must Be Positive')
    .when('moneyDeposit', {
      is: true,
      then: (schema) => schema.required('Maximum Deposit is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  // Money Won
  moneyWon: Yup.boolean(),
  minWon: Yup.number()
    .typeError('Minimum Won must be a number')
    .min(0, 'Minimum Won Must Be Positive')
    .when('moneyWon', {
      is: true,
      then: (schema) => schema.required('Minimum Won is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  maxWon: Yup.number()
    .typeError('Maximum Won must be a number')
    .min(0, 'Maximum Won Must Be Positive')
    .when('moneyWon', {
      is: true,
      then: (schema) => schema.required('Maximum Won is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),

  // Money Loss
  moneyLoss: Yup.boolean(),
  minLoss: Yup.number()
    .typeError('Minimum Loss must be a number')
    .min(0, 'Minimum Loss Must Be Positive')
    .when('moneyLoss', {
      is: true,
      then: (schema) => schema.required('Minimum Loss is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  maxLoss: Yup.number()
    .typeError('Maximum Loss must be a number')
    .min(0, 'Maximum Loss Must Be Positive')
    .when('moneyLoss', {
      is: true,
      then: (schema) => schema.required('Maximum Loss is required'),
      otherwise: (schema) => schema.notRequired()
    })
    .test('max-2-decimals', 'Only up to 2 decimal places are allowed', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    })
});
