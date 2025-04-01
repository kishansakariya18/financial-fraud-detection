import * as Yup from 'yup';

export const createAdminSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string().trim().required('First Name Required'),
  lastName: Yup.string().trim().required('Last Name Required'),
  userName: Yup.string().trim().required('User Name Required'),
  password: Yup.string().trim().required('Password Required'),
  email: Yup.string().trim().email('Invalid Email').required('Email Required'),
  mobile: Yup.string()
    .trim()
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number')
    .required('Enter Your Mobile Number'),
  status: Yup.string().trim().required('Choose Your Status'),
  roles: Yup.string().trim().required('Choose Admin Roles'),
  isMasterAdmin: Yup.boolean()
});
export const editAdminSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string().trim().required('First Name Required'),
  lastName: Yup.string().trim().required('Last Name Required'),
  userName: Yup.string().trim().required('User Name Required'),
  password: Yup.string().trim(),
  email: Yup.string().trim().email('Invalid Email').required('Email Required'),
  mobile: Yup.string()
    .trim()
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number')
    .required('Enter Your Mobile Number'),
  status: Yup.string().trim().required('Choose Your Status'),
  roles: Yup.string().trim().required('Choose Admin Roles'),
  isMasterAdmin: Yup.boolean()
});
