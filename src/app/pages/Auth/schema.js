import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  mobile: Yup.string()
    .trim()
    .required('Mobile Is Required')
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Invalid Mobile Number')
    .length(10, 'Mobile Length Must Be 10'),
  password: Yup.string().trim().required('Password Is Required')
  // password: Yup.string()
  //   .required('Password is required')
  //   .min(8, 'Password must be at least 8 characters')
  //   .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  //   .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  //   .matches(/[0-9]/, 'Password must contain at least one number')
  //   .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});
export const otpVerificationSchema = Yup.object().shape({
  otp: Yup.string().trim().required('OTP Is Required').length(6, 'OTP Length Must be 6')
});
export const forgotPasswordSchema = Yup.object().shape({
  mobile: Yup.string()
    .trim()
    .required('Mobile Is Required')
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Invalid Mobile Number')
    .length(10, 'Mobile Length Must Be 10'),
  email: Yup.string()
    .trim()
    .required('Email Is Required')
    .matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid Email Address')
});

export const resetPasswordSchema = Yup.object().shape({
  otp: Yup.string().trim().required('OTP Is Required').length(6, 'OTP Length Must be 6'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .trim()
    .required('Confirm Password Is Required')
    .oneOf([Yup.ref('password'), null], 'Passwords Must Match With New Password')
});
