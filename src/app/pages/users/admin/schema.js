import * as Yup from 'yup';

export const createAdminSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string()
    .trim()
    .required('First Name Required')
    .max(40, 'Maximum 40 Characters Allowed'),
  lastName: Yup.string()
    .trim()
    .required('Last Name Required')
    .max(40, 'Maximum 40 Characters Allowed'),
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
    .matches(
      /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      'Enter a valid email address without the "+" symbol'
    ),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
  phoneCode: Yup.string().trim().required('Select Country Code'),
  status: Yup.string().trim().required('Select Status'),
  roles: Yup.string().trim().required('Select Admin Role'),
  isMasterAdmin: Yup.boolean()
});
export const editAdminSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string()
    .trim()
    .required('First Name Required')
    .max(40, 'Maximum 40 Characters Allowed'),
  lastName: Yup.string()
    .trim()
    .required('Last Name Required')
    .max(40, 'Maximum 40 Characters Allowed'),
  userName: Yup.string()
    .trim()
    .required('User Name Required')
    .matches(
      /^(?!.*__)[a-zA-Z][a-zA-Z0-9_]{1,28}[a-zA-Z0-9]$/,
      'Username must start with a letter, contain only letters, numbers, or underscores, cannot have consecutive or ending underscores, and must be 3–30 characters long.'
    ),
  password: Yup.string()
    .trim()
    .test(
      'password-validation',
      'Minimum 8 Character Required, Atleast One Letter and One Number and One Special Character',
      (value) => {
        if (!value || value.length === 0) return true; // skip if empty
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
      }
    ),
  email: Yup.string()
    .trim()
    .required('Email Required')
    .matches(
      /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      'Enter a valid email address without the "+" symbol'
    ),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits'),
  phoneCode: Yup.string().trim().required('Select Country Code'),
  status: Yup.string().trim().required('Select Your Status'),
  roles: Yup.string().trim().required('Select Admin Role'),
  isMasterAdmin: Yup.boolean()
});
