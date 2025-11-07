import * as Yup from 'yup';

export const createAffiliateSchema = Yup.object().shape({
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
  firstName: Yup.string().trim().max(40, 'Maximum 40 Characters Allowed'),
  lastName: Yup.string().trim().max(40, 'Maximum 40 Characters Allowed'),
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
