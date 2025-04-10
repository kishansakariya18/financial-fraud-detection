import * as Yup from 'yup';

export const validateSchema = Yup.object().shape({
  // Personal Information
  name: Yup.string().trim().required('Category Name Required')
});
