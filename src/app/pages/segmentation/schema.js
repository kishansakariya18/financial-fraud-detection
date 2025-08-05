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
    })
    .test('is-greater-than-min', 'Maximum age must be greater than minimum age', function (value) {
      if (value === undefined || value === null || !this.parent.ageGroup) return true;
      const minAge = this.parent.minAge;
      return minAge === undefined || value > minAge;
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
    })
    .test(
      'is-greater-than-min',
      'Maximum login count must be greater than minimum login count',
      function (value) {
        if (value === undefined || value === null || !this.parent.loginCounter) return true;
        const minLoginCount = this.parent.minLoginCount;
        return minLoginCount === undefined || value > minLoginCount;
      }
    ),

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
    })
    .test(
      'is-greater-than-min',
      'Maximum referral count must be greater than minimum referral count',
      function (value) {
        if (value === undefined || value === null || !this.parent.referral) return true;
        const minReferral = this.parent.minReferral;
        return minReferral === undefined || value > minReferral;
      }
    ),

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
    })
    .test(
      'is-greater-than-min',
      'Maximum deposit must be greater than minimum deposit',
      function (value) {
        if (value === undefined || value === null || !this.parent.moneyDeposit) return true;
        const minDeposit = this.parent.minDeposit;
        return minDeposit === undefined || value > minDeposit;
      }
    ),

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
    })
    .test('is-greater-than-min', 'Maximum won must be greater than minimum won', function (value) {
      if (value === undefined || value === null || !this.parent.moneyWon) return true;
      const minWon = this.parent.minWon;
      return minWon === undefined || value > minWon;
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
    .test(
      'is-greater-than-min',
      'Maximum loss must be greater than minimum loss',
      function (value) {
        if (value === undefined || value === null || !this.parent.moneyLoss) return true;
        const minLoss = this.parent.minLoss;
        return minLoss === undefined || value > minLoss;
      }
    )
});
