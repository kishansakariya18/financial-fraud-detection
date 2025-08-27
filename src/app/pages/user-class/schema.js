import * as Yup from 'yup';

export const createUserClassSchema = Yup.object().shape({
  // Personal Information
  className: Yup.string()
    .trim()
    .min(3, 'Class Name must be at least 3 characters')
    .max(20, 'Class Name must be at most 20 characters')
    .required('Class Name Required'),
  classCode: Yup.string()
    .trim()
    .min(3, 'Class Code must be at least 3 characters')
    .max(20, 'Class Code must be at most 20 characters')
    .required('Class Code Required')
});
