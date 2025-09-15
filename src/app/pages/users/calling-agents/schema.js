import * as Yup from 'yup';

export const createCallingAgentSchema = Yup.object().shape({
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
    .max(40, 'Maximum 40 Characters Allowed'),
  password: Yup.string()
    .trim()
    .required('Password Required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Minimum 8 Character Required, Atleast One Letter and One Number and One Special Character'
    ),
  email: Yup.string().trim().required('Email Required').email('Invalid Email'),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
  phoneCode: Yup.string().trim().required('Select Country Code'),
  status: Yup.string().trim().required('Select Status')
});

export const editCallingAgentSchema = Yup.object().shape({
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
    .max(40, 'Maximum 40 Characters Allowed'),
  password: Yup.string()
    .trim()
    .transform((value) => value || null)
    .optional()
    .nullable()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Minimum 8 Character Required, Atleast One Letter and One Number and One Special Character'
    ),
  email: Yup.string().trim().required('Email Required').email('Invalid Email'),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
  phoneCode: Yup.string().trim().required('Select Country Code'),
  status: Yup.string().trim().required('Select Status')
});
