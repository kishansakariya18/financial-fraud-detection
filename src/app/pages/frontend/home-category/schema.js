import * as Yup from 'yup';

export const changeCategorySchema = Yup.object().shape({
  // Personal Information
  category: Yup.number().required('Category Required')
});
