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
    .max(40, 'Maximum 40 Characters Allowed'),
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
  email: Yup.string().trim().required('Email Required').email('Invalid Email'),
  mobile: Yup.string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits'),
  phoneCode: Yup.string().trim().required('Select Country Code'),
  status: Yup.string().trim().required('Select Your Status'),
  roles: Yup.string().trim().required('Select Admin Role'),
  isMasterAdmin: Yup.boolean()
});
