import * as Yup from 'yup';

export const currencySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  is_active: Yup.boolean()
});
