import * as Yup from 'yup';

export const pagesSchema = Yup.object().shape({
  // Personal Information
  name: Yup.string()
    .trim()
    .max(100, 'Name must be less than or equal to 100 characters')
    .required('Name Required'),
  content: Yup.string()
    .trim()
    .max(5000, 'Content must be less than or equal to 5000 characters')
    .required('Content Required'),
  status: Yup.string().trim().required('Select Status')
});
