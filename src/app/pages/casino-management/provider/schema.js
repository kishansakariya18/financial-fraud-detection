import * as Yup from 'yup';

export const editProviderSchema = Yup.object().shape({
  // Personal Information
  providerName: Yup.string().required('Provider Name Required')
});
