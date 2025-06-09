import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  mobile: Yup.string()
    .trim()
    .required('Mobile Is Required')
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Invalid Mobile Number')
    .length(10, 'Mobile Length Must Be 10'),

  password: Yup.string().trim().required('Password Is Required')
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
  password: Yup.string().trim().required('Password Is Required'),
  confirmPassword: Yup.string()
    .trim()
    .required('Confirm Password Is Required')
    .oneOf([Yup.ref('password'), null], 'Passwords Must Match With New Password')
});
