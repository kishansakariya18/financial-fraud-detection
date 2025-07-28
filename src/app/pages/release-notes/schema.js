// Import Dependencies
import * as Yup from 'yup';

export const addRoleSchema = Yup.object().shape({
  roleName: Yup.string().trim().max(50, 'Role Name Too Long!').required('Role Name Required'),
  permissionsIdList: Yup.array()
    .of(Yup.number())
    .min(1, 'Please select at least one permission')
    .required('Please select at least one permission')
});
