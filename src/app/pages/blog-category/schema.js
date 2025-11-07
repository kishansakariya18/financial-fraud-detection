import * as Yup from 'yup';

export const createBlogCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required').max(255, 'Maximum 255 characters allowed'),
  isActive: Yup.number().oneOf([0, 1], 'Invalid active value')
});

export const editBlogCategorySchema = Yup.object().shape({
  name: Yup.string().trim().max(255, 'Maximum 255 characters allowed'),
  isActive: Yup.number().oneOf([0, 1], 'Invalid active value')
});
