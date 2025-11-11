import { CheckBadgeIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import * as Yup from 'yup';

export const createAffiliateSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string()
    .trim()
    .required('First Name Required')
    .matches(
      /^[A-Za-z]{3,15}$/,
      'First name must be 3–15 alphabetic characters with no spaces or special symbols'
    ),
  lastName: Yup.string()
    .trim()
    .required('Last Name Required')
    .max(40, 'Last name must be 3–15 alphabetic characters with no spaces or special symbols')
    .matches(
      /^[A-Za-z]{3,15}$/,
      'Last name must be 3–15 alphabetic characters with no spaces or special symbols'
    ),
  userName: Yup.string()
    .trim()
    .required('User Name Required')
    .matches(
      /^(?!.*__)[a-zA-Z][a-zA-Z0-9_]{1,28}[a-zA-Z0-9]$/,
      'Username must start with a letter, contain only letters, numbers, or underscores, cannot have consecutive or ending underscores, and must be 3–30 characters long.'
    ),
  password: Yup.string()
    .trim()
    .required('Password Required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Minimum 8 Character Required, Atleast One Letter and One Number and One Special Character'
    ),
  email: Yup.string()
    .trim()
    .required('Email Required')
    .email('Invalid Email')
    .matches(/^[^+]+$/, 'Email with "+" symbol is not allowed'),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
  phoneCode: Yup.string().trim().required('Select Country Code'),
  gender: Yup.string().trim().required('Select Gender'),
  dateOfBirth: Yup.string()
    .trim()
    .required('Select Date of Birth')
    .test('is-18-years-old', 'You must be at least 18 years old', (value) => {
      if (!value) return false;
      const today = new Date();
      const dob = new Date(value);
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      // Adjust if birthday hasn't occurred yet this year
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;

      return actualAge >= 18;
    })
});
export const editAffiliateSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z]{3,15}$/,
      'First name must be 3–15 alphabetic characters with no spaces or special symbols'
    ),
  lastName: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z]{3,15}$/,
      'Last name must be 3–15 alphabetic characters with no spaces or special symbols'
    ),
  gender: Yup.string().trim().required('Select Gender'),
  dateOfBirth: Yup.string()
    .trim()
    .required('Select Date of Birth')
    .test('is-18-years-old', 'You must be at least 18 years old', (value) => {
      if (!value) return false;
      const today = new Date();
      const dob = new Date(value);
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      // Adjust if birthday hasn't occurred yet this year
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;

      return actualAge >= 18;
    })
});

export const affiliateStatusOptions = [
  {
    value: 'ACTIVE',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'CLOSED',
    label: 'Closed',
    color: 'error',
    icon: NoSymbolIcon
  }
];
