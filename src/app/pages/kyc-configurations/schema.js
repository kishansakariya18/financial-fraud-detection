import * as Yup from 'yup';

export const kycLevelConfigSchema = Yup.object().shape({
  mappings: Yup.array()
    .of(
      Yup.object().shape({
        slug: Yup.string().required('Slug is required'),
        provider: Yup.mixed().nullable().required('Please select a provider')
      })
    )
    .min(1, 'At least one configuration is required')
});
