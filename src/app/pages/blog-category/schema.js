import * as Yup from 'yup';

export const createBlogCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required').max(30, 'Maximum 30 characters allowed'),
  isActive: Yup.number().oneOf([0, 1], 'Invalid active value'),
  image: Yup.mixed()
    .required('Image is required')
    .test('fileSize', 'File size must be less than 2MB', (value) => {
      if (!value) return false; // Required, so fail if no value
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only JPEG and PNG images are allowed', (value) => {
      if (!value) return false; // Required, so fail if no value
      return value.type === 'image/jpeg' || value.type === 'image/png';
    })
});

export const editBlogCategorySchema = Yup.object().shape({
  name: Yup.string().trim().max(30, 'Maximum 30 characters allowed'),
  isActive: Yup.number().oneOf([0, 1], 'Invalid active value'),
  image: Yup.mixed()
    .nullable() // Image is optional in edit mode
    .test('fileSize', 'File size must be less than 2MB', (value) => {
      if (!value) return true; // Optional, so pass if no value
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only JPEG and PNG images are allowed', (value) => {
      if (!value) return true; // Optional, so pass if no value
      return value.type === 'image/jpeg' || value.type === 'image/png';
    })
});
