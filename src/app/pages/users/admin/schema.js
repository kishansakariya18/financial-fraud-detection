import * as Yup from 'yup';

export const createAdminSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string().trim().required('First Name Required'),
  lastName: Yup.string().trim().required('Last Name Required'),
  userName: Yup.string().trim().required('User Name Required'),
  password: Yup.string()
    .trim()
    .required('Password Required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      'Minimum 8 Character Required, Atleast One Letter and One Number'
    ),
  email: Yup.string().trim().required('Email Required').email('Invalid Email'),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
  status: Yup.string().trim().required('Select Your Status'),
  roles: Yup.string().trim().required('Select Admin Role'),
  isMasterAdmin: Yup.boolean()
});
export const editAdminSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string().trim().required('First Name Required'),
  lastName: Yup.string().trim().required('Last Name Required'),
  userName: Yup.string().trim().required('User Name Required'),
  password: Yup.string()
    .trim()
    .test(
      'password-validation',
      'Minimum 8 characters, at least one letter and one number',
      (value) => {
        if (!value || value.length === 0) return true; // skip if empty
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
      }
    ),
  email: Yup.string().trim().required('Email Required').email('Invalid Email'),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits'),
  status: Yup.string().trim().required('Select Your Status'),
  roles: Yup.string().trim().required('Select Admin Role'),
  isMasterAdmin: Yup.boolean()
});
