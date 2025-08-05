import * as Yup from 'yup';

export const createAffiliateSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string().trim().required('First Name Required'),
  lastName: Yup.string().trim().required('Last Name Required'),
  userName: Yup.string().trim().required('User Name Required'),
  referralCode: Yup.string()
    .trim()
    .required('Referral Code Required')
    .matches(/^[A-Za-z0-9]{10}$/, 'Must Be 10 Character, and Not Special Charater Allowed'),
  password: Yup.string()
    .trim()
    .required('Password Required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Minimum 8 Character Required, Atleast One Letter and One Number and One Special Character'
    ),
  confirmPassword: Yup.string()
    .trim()
    .required('Confirm Password Required')
    .oneOf([Yup.ref('password'), null], 'Passwords Must Match With Confirm Password'),
  email: Yup.string().trim().required('Email Required').email('Invalid Email'),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
  status: Yup.string().trim().required('Select Status'),
  perDeposit: Yup.boolean(),
  perPlayerLoss: Yup.boolean(),
  perSignup: Yup.boolean(),
  signupCommission: Yup.string()
    .trim()
    .when('perSignup', {
      is: true,
      then: (schema) => schema.required('Signup Commission Required'),
      otherwise: (schema) => schema.notRequired()
    }),
  depositCommission: Yup.string()
    .trim()
    .when('perDeposit', {
      is: true,
      then: (schema) => schema.required('Deposit Commission Required'),
      otherwise: (schema) => schema.notRequired()
    }),
  playerLossCommission: Yup.string()
    .trim()
    .when('perPlayerLoss', {
      is: true,
      then: (schema) => schema.required('Player Loss Commission Required'),
      otherwise: (schema) => schema.notRequired()
    }),
  playerLossCommissionType: Yup.string()
    .trim()
    .when('perPlayerLoss', {
      is: true,
      then: (schema) => schema.required('Player Loss Commission Type Required'),
      otherwise: (schema) => schema.notRequired()
    }),
  depositCommissionType: Yup.string()
    .trim()
    .when('perDeposit', {
      is: true,
      then: (schema) => schema.required('Deposit Commission Type Required'),
      otherwise: (schema) => schema.notRequired()
    })
});

export const editAffiliateSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string().trim().required('First Name Required'),
  lastName: Yup.string().trim().required('Last Name Required'),
  userName: Yup.string().trim().required('User Name Required'),
  referralCode: Yup.string()
    .trim()
    .required('Referral Code Required')
    .matches(/^[A-Za-z0-9]{10}$/, 'Must Be 10 Character, and Not Special Charater Allowed.'),
  email: Yup.string().trim().required('Email Required').email('Invalid Email'),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
  status: Yup.string().trim().required('Select Status'),

  // Commission Toggles
  perDeposit: Yup.boolean(),
  perPlayerLoss: Yup.boolean(),
  perSignup: Yup.boolean(),

  // Conditional Fields
  signupCommission: Yup.string()
    .trim()
    .when('perSignup', {
      is: true,
      then: (schema) => schema.required('Signup Commission Required'),
      otherwise: (schema) => schema.notRequired()
    }),
  depositCommission: Yup.string()
    .trim()
    .when('perDeposit', {
      is: true,
      then: (schema) => schema.required('Deposit Commission Required'),
      otherwise: (schema) => schema.notRequired()
    }),
  playerLossCommission: Yup.string()
    .trim()
    .when('perPlayerLoss', {
      is: true,
      then: (schema) => schema.required('Player Loss Commission Required'),
      otherwise: (schema) => schema.notRequired()
    }),
  playerLossCommissionType: Yup.string()
    .trim()
    .when('perPlayerLoss', {
      is: true,
      then: (schema) => schema.required('Player Loss Commission Type Required'),
      otherwise: (schema) => schema.notRequired()
    }),
  depositCommissionType: Yup.string()
    .trim()
    .when('perDeposit', {
      is: true,
      then: (schema) => schema.required('Deposit Commission Type Required'),
      otherwise: (schema) => schema.notRequired()
    })
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
  fundMessage: Yup.string().trim().required('Fund Message Required'),
  type: Yup.string().trim().required('Type Required')
});
