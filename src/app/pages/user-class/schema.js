import * as Yup from 'yup';

export const createUserClassSchema = Yup.object().shape({
  // Personal Information
  className: Yup.string().trim().required('Class Name Required'),
  classCode: Yup.string().trim().required('Class Code Required')
});
