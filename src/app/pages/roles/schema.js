// Import Dependencies
import * as Yup from 'yup';

export const addRoleSchema = Yup.object().shape({
  roleName: Yup.string()
    .trim()
    .min(2, 'Role Name Too Short!')
    .max(50, 'Role Name Too Long!')
    .required('Role Name Required'),
  description: Yup.string().trim().required('Description Required')
});
