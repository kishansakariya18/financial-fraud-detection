import * as Yup from 'yup';

export const blogSchema = (isEdit = false) => {
  const baseSchema = {
    title: isEdit
      ? Yup.string().trim().max(200, 'Maximum 200 characters allowed')
      : Yup.string()
          .trim()
          .required('Title is required')
          .max(200, 'Maximum 200 characters allowed'),
    slug: Yup.string().trim().optional().max(200, 'Maximum 200 characters allowed'),
    content: isEdit
      ? Yup.string().trim().min(10, 'Content must be at least 10 characters')
      : Yup.string().trim().required('Content is required'),
    blogCategoryId: Yup.number().required('Blog category is required'),
    shortDescription: Yup.string().trim().max(500, 'Maximum 500 characters allowed'),
    metaTitle: Yup.string().trim().max(200, 'Maximum 200 characters allowed'),
    metaDescription: Yup.string().trim(),
    authorName: Yup.string().trim(),
    tags: Yup.array().of(Yup.string().trim()),
    isFeatured: Yup.number().oneOf([0, 1], 'Invalid featured value'),
    isActive: Yup.number().oneOf([0, 1], 'Invalid active value')
  };

  return Yup.object().shape(baseSchema);
};

export const createBlogSchema = blogSchema(false);
export const editBlogSchema = blogSchema(true);
