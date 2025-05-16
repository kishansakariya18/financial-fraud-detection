import * as Yup from 'yup';

export const pagesSchema = Yup.object().shape({
  // Personal Information
  name: Yup.string().trim().required('Name Required'),
  content: Yup.string().trim().required('Content Required'),
  status: Yup.string().trim().required('Select Status')
});
