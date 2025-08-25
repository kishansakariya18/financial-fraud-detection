import * as Yup from 'yup';

export const validateSchema = Yup.object().shape({
  // Personal Information
  name: Yup.string()
    .trim()
    .required('Category name is required')
    .min(3, 'Category name must be at least 3 characters')
    .max(20, 'Category name must be at most 20 characters')
    .matches(
      /^[A-Za-z0-9 _.-]+$/,
      'Only letters, numbers, spaces, dot, dash and underscore are allowed'
    )
});
