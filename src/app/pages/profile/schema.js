import * as Yup from 'yup';
export const editProfileSchema = Yup.object().shape({
  firstName: Yup.string().trim().required('Current Password Required'),
  lastName: Yup.string().trim().required('New Password Required'),
  email: Yup.string().trim().required('Verify Password Required'),
  mobile: Yup.string().trim().required('Verify Password Required')
});

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().trim().required('Current Password Required'),
  newPassword: Yup.string().trim().required('New Password Required'),
  verifyPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords Must Match With New Password')
    .required('Verify Password Required')
});
