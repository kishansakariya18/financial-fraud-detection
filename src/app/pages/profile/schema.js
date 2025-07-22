import * as Yup from 'yup';
export const editProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters')
    .max(50, 'First Name must be at most 50 characters'),
  lastName: Yup.string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .max(50, 'Last Name must be at most 50 characters'),
  email: Yup.string().trim().required('Email is required').email('Invalid Email Address'),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number')
});

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().trim().required('Current Password Required'),
  newPassword: Yup.string()
    .required('New Password is required')
    .min(8, 'New Password must be at least 8 characters')
    .matches(/[A-Z]/, 'New Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'New Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'New Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'New Password must contain at least one special character'),
  verifyPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords Must Match With New Password')
    .required('Verify Password Required')
});
