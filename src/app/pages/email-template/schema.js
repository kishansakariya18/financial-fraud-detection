import * as Yup from 'yup';

export const emailTemplateSchema = Yup.object().shape({
  // Personal Information
  title: Yup.string().trim().required('Title Required'),
  slug: Yup.string().trim(),
  heading: Yup.string().trim().required('Subject Required'),
  to: Yup.array().of(Yup.string().email('Enter Valid Email')),
  cc: Yup.array().of(Yup.string().email('Enter Valid Email')),
  bcc: Yup.array().of(Yup.string().email('Enter Valid Email')),
  status: Yup.string().trim().required('Select Status')
});
